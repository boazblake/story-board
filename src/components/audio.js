import m from "mithril";
import WaveSurfer from 'wavesurfer.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { compose } from 'ramda'

// Give regions a random color when they are created
const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

export const addRegion = ({ mdl, playerState, imageDto }) => {
    const content = document.createElement('img')
    content.style['max-width'] = '100px'
    content.style['max-height'] = '140px'
    // content.style['overflow'] = 'hidden'
    content.src = imageDto.src
    content.uuid = imageDto.uuid
    content.alt = imageDto.name
    const region = mdl.wavesurfer.regions.addRegion({
        start: imageDto.timeStart,
        end: imageDto.timeEnd,
        content,
        color: randomColor()
    })
    playerState.regions.push(region)
    log('mdl')(mdl, region)
}

const initWSModel = ({ dom, playerState }) => ({ mdl }) => {
    console.log(mdl)
    mdl.wavesurfer.model = WaveSurfer.create({
        container: dom,
        //height: 110,
        // width: 594,
        splitChannels: false,
        normalize: false,
        waveColor: "#ff4e00",
        progressColor: "#dd5e98",
        cursorColor: "#ddd5e9",
        cursorWidth: 2,
        barWidth: null,
        barGap: null,
        barRadius: null,
        barHeight: null,
        barAlign: "",
        minPxPerSec: 1,
        fillParent: true,
        mediaControls: true,
        autoplay: false,
        interact: false,
        dragToSeek: true,
        hideScrollbar: false,
        audioRate: 1,
        autoScroll: true,
        autoCenter: true,
        sampleRate: 8000,
        waveColor: '#4F4A85',
        progressColor: '#383351',
        url: playerState.recording.audio,
        minPxPerSec: 10,
        xhr: {
            cache: "default",
            mode: "cors",
            method: "GET",
            headers: ['Access-Control-Allow-Origin:origin']
        },
    })
    return { mdl }
}

const initTimeLine = ({ mdl }) => {
    console.log('init, mdl', mdl)
    mdl.wavesurfer.timeline = mdl.wavesurfer.model.registerPlugin(Timeline.create({
        // height: 20,
        insertPosition: 'beforebegin',
        timeInterval: 0.2,
        primaryLabelInterval: 5,
        secondaryLabelInterval: 1,
        style: {
            // fontSize: '20px',
            // color: '#2D5B88',
        },
    }))
    mdl.wavesurfer.timeline.on("timeline-clicked", x => console.log(x))


    return { mdl }
}


const initRegions = ({ playerState }) => ({ mdl }) => {
    mdl.wavesurfer.regions = mdl.wavesurfer.model.registerPlugin(Regions.create())



    mdl.wavesurfer.regions.enableDragSelection({
        color: 'rgba(255, 0, 0, 0.1)',
    })

    mdl.wavesurfer.regions.on('region-updated', (region) => {
        console.log('Updated region', region)
    })
    mdl.wavesurfer.regions.on('region-clicked', (region, e) => {
        console.log('region-clicked', region, e)
        e.stopPropagation() // prevent triggering a click on the waveform
        playerState.activeRegion = region
        region.play()
        region.setOptions({ color: randomColor() })
    })
    // Reset the active region when the user clicks anywhere in the waveform
    mdl.wavesurfer.model.on('interaction', (time) => {
        console.log('interaction', time)
        mdl.wavesurfer.regions.addRegion({
            start: time,
            end: time + 5,
            content: recording.files[0].src,
            color: randomColor()
        })
        playerState.activeRegion = null
    })
    // Update the zoom level on slider change
    // mdl.wavesurfer.model.once('decode', () => {
    //     document.querySelector('input[type="range"]').oninput = (e) => {
    //         const minPxPerSec = Number(e.target.value)
    //         ws.zoom(minPxPerSec)
    //     }
    // })
    return { mdl }
}

const onDecode = ({ playerState }) => ({ mdl }) => {
    mdl.wavesurfer.model.on('decode', () => {
        playerState.status = 'loaded'
        m.redraw()
    })
    return { mdl }
}

const initAudio = ({ mdl, playerState, dom }) => compose(onDecode({ playerState }), initRegions({ playerState }), initTimeLine, initWSModel({ dom, playerState }))({ mdl })






export const Audio = {
    oncreate: ({ dom, attrs: { mdl, playerState } }) =>
        initAudio({ mdl, playerState, dom }),
    view: ({ attrs: { playerState } }) =>
        m("section",
            playerState.status == 'loading' && m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Loading Audio'),
        ),
};