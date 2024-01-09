import m from "mithril";
import WaveSurfer from 'wavesurfer.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { compose } from 'ramda'

// Give regions a random color when they are created
const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`


const canvasRepresentationOfImage = ({ imageDto }) => {
    // content.uuid = imageDto.uuid
    // content.alt = imageDto.name

    const calcWidthHeight = (w, h) => {
        const width = 100;

        // Calculate the new height while maintaining the aspect ratio
        const height = (h / w) * width

        return { width, height }
    }

    var canvas = document.createElement('canvas');
    const { width, height } = calcWidthHeight(imageDto.width, imageDto.height)
    canvas.width = width;
    canvas.height = height;
    canvas['data-uuids'] = imageDto.uuid
    var ctx = canvas.getContext('2d');
    var img = new Image(imageDto.src);
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    img.src = imageDto.src;
    return canvas
}

export const addRegion = ({ mdl, playerState, imageDto }) => {

    const content = canvasRepresentationOfImage({ imageDto })
    const region = mdl.wavesurfer.regions.addRegion({
        start: imageDto.timeStart,
        end: imageDto.timeEnd,
        content,
        color: randomColor(),
        //id: playerState.recording.name
    })
    playerState.regions = playerState.regions.concat([region])
}

const initWSModel = ({ dom, playerState }) => ({ mdl }) => {
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
        // xhr: {
        //     cache: "default",
        //     mode: "cors",
        //     method: "GET",
        //     headers: ['Access-Control-Allow-Origin:origin']
        // },
    })
    mdl.wavesurfer.model.on('timeupdate', (currentTime) => {
        playerState.currentTime = currentTime

        const currentlyPlayingRegions = region => playerState.currentTime >= region.start && playerState.currentTime <= region.end

        playerState.activeRegions = playerState.regions.filter(currentlyPlayingRegions)
        m.redraw()
    })
    mdl.wavesurfer.model.on('seeking', (currentTime) => {
        playerState.currentTime = currentTime

        const currentlyPlayingRegions = region => playerState.currentTime >= region.start && playerState.currentTime <= region.end

        playerState.activeRegions = playerState.regions.filter(currentlyPlayingRegions)
        m.redraw()
    })
    mdl.wavesurfer.model.on('interaction', (currentTime) => {
        playerState.currentTime = currentTime

        const currentlyPlayingRegions = region => playerState.currentTime >= region.start && playerState.currentTime <= region.end

        playerState.activeRegions = playerState.regions.filter(currentlyPlayingRegions)
        m.redraw()
    })


    mdl.wavesurfer.model.on('play', () => {
        m.redraw()
    })
    mdl.wavesurfer.model.on('pause', () => {
        m.redraw()
    })
    mdl.wavesurfer.model.on('finish', () => {
        m.redraw()
    })

    mdl.wavesurfer.model.on('click', (x) => {
        console.log('click', x)
        m.redraw()
    })
    mdl.wavesurfer.model.on('drag', (x) => {
        console.log('drag', x)
        m.redraw()
    })

    mdl.wavesurfer.model.on('scroll', (visibleStartTime, visibleEndTime) => {
        //  console.log('Scroll', visibleStartTime + 's', visibleEndTime + 's')
        m.redraw()
    })

    mdl.wavesurfer.model.on('zoom', (minPxPerSec) => {
        mdl.wavesurfer.model.minPxPerSec = minPxPerSec
        m.redraw()
    })


    // Reset the active region when the user clicks anywhere in the waveform
    // mdl.wavesurfer.model.on('interaction', (time) => {
    //     mdl.wavesurfer.regions.addRegion({
    //         start: time,
    //         end: time + 5,
    //         content: recording.files[0].src,
    //         color: randomColor()
    //     })
    //     playerState.activeRegions = null
    // })
    // Update the zoom level on slider change
    // mdl.wavesurfer.model.once('decode', () => {
    //     document.querySelector('input[type="range"]').oninput = (e) => {
    //         const minPxPerSec = Number(e.target.value)
    //         ws.zoom(minPxPerSec)
    //     }
    // })
    return { mdl }
}

const initTimeLine = ({ mdl }) => {
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
    mdl.wavesurfer.timeline.on("timeline-clicked", (log('time-clicked'), m.redraw()))


    return { mdl }
}


const initRegions = ({ playerState }) => ({ mdl }) => {
    mdl.wavesurfer.regions = mdl.wavesurfer.model.registerPlugin(Regions.create())

    mdl.wavesurfer.regions.enableDragSelection({
        color: 'rgba(255, 0, 0, 0.1)',
    })

    mdl.wavesurfer.regions.on('region-updated', (region) => {
        //update region
        playerState.regions = playerState.activeRegions.filter(r => r.id !== region.id).concat([region])
        m.redraw()
    })
    mdl.wavesurfer.regions.on('region-clicked', (region, e) => {
        e.stopPropagation() // prevent triggering a click on the waveform
        playerState.activeRegions = region
        region.play()
        region.setOptions({ color: randomColor() })
        playerState.activeRegions = region
        m.redraw()
    })

    return { mdl }
}

const onDecode = ({ playerState }) => ({ mdl }) => {
    mdl.wavesurfer.model.on('decode', () => {
        playerState.status = 'loaded'
        m.redraw()
    })
    return { mdl }
}

const initAudio = ({ mdl, playerState, dom }) => compose(
    onDecode({ playerState }),
    initRegions({ playerState }),
    initTimeLine,
    initWSModel({ dom, playerState }))
    ({ mdl })






export const Audio = {
    oncreate: ({ dom, attrs: { mdl, playerState } }) =>
        initAudio({ mdl, playerState, dom }),
    view: ({ attrs: { playerState } }) =>
        m("section",
            playerState.status == 'loading' && m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Loading Audio'),
        ),
};