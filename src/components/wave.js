import m from "mithril";
import WaveSurfer from 'wavesurfer.js'

const waveState = {
    status: 'loading',
    mdl: null,
    options: {
        container: null,
        height: 110,
        width: 594,
        splitChannels: false,
        normalize: false,
        waveColor: "#ff4e00",
        progressColor: "#dd5e98",
        cursorColor: "#ddd5e9",
        cursorWidth: 2,
        barHeight: null,
        barAlign: "",
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
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
        url: "",
        minPxPerSec: 10,
        onWSTimeUpdate: log('onWSTimeUpdate'),
        onWSeeking: log('onWSeeking'),
        onWSInteraction: log('onWSInteraction'),
        onWSplay: log('onWSplay'),
        onWSpause: log('onWSpause'),
        onWSfinish: log('onWSfinish'),
        onWSclick: log('onWSclick'),
        onWSdrag: log('onWSdrag'),
        onWSscroll: log('onWSscroll'),
        onWSzoom: log('onWSzoom'),
        // xhr: {
        //     cache: "default",
        //     mode: "cors",
        //     method: "GET",
        //     headers: ['Access-Control-Allow-Origin:origin']
        // },
    }
}

const initWaveSurfer = ({ dom, attrs, waveState }) => new Promise((res) => {
    waveState.options.container = dom
    waveState.mdl = WaveSurfer.create(waveState.options)
    waveState.mdl.on('timeupdate', waveState.options.onWSTimeUpdate)
    waveState.mdl.on('seeking', waveState.options.onWSeeking)
    waveState.mdl.on('interaction', waveState.options.onWSInteraction)
    waveState.mdl.on('play', waveState.options.onWSplay)
    waveState.mdl.on('pause', waveState.options.onWSpause)
    waveState.mdl.on('finish', waveState.options.onWSfinish)
    waveState.mdl.on('click', waveState.options.onWSclick)
    waveState.mdl.on('drag', waveState.options.onWSdrag)
    waveState.mdl.on('scroll', waveState.options.onWSscroll)
    waveState.mdl.on('zoom', waveState.options.onWSzoom)
    console.log(waveState)
    return res({ dom, attrs, waveState })
})

const initWaveOptions = ({ waveOptions }) =>
    waveState.options = { ...waveState.options, ...waveOptions }


export const Wave = ({ attrs: { waveOptions } }) => {

    initWaveOptions({ waveOptions })

    return {
        oncreate: ({ dom, attrs }) => initWaveSurfer({ dom, attrs, waveState }).then(attrs.onCreatedWave),
        view: () =>
            m("section.wave-surfer"),
    }
}