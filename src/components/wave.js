import m from "mithril";
import WaveSurfer from 'wavesurfer.js'
import { log } from '@/utils'
import { canvasRepresentationOfImage } from '@/components/canvas'

export const addRegion = ({ mdl, imageDto, options }) => {
    return new Promise((res) => {
        const content = canvasRepresentationOfImage({ imageDto })
        const region = mdl.regions.addRegion({
            start: options.start || 0,
            end: options.end || 5,
            content,
            color: options.color || randomColor(),
            id: options.id || null
        })
        m.redraw()
        return res(region)
    })


}

const waveState = {
    status: 'loading',
    mdl: null,
    events: {
        onWSTimeUpdate: () => { }, //log('onWSTimeUpdate'),
        onWSeeking: log('onWSeeking'),
        onWSInteraction: log('onWSInteraction'),
        onWSplay: log('onWSplay'),
        onWSpause: log('onWSpause'),
        onWSfinish: log('onWSfinish'),
        onWSclick: log('onWSclick'),
        onWSdrag: log('onWSdrag'),
        onWSscroll: () => { }, //log('onWSscroll'),
        onWSzoom: () => { },//log('onWSzoom')
    },
    options: {
        container: null,
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
        xhr: {
            cache: "default",
            mode: "cors",
            method: "GET",
            headers: ['Access-Control-Allow-Origin:origin']
        },
    }
}

const initWaveSurfer = ({ dom, attrs, waveState }) => new Promise((res) => {
    waveState.options.container = dom
    waveState.mdl = WaveSurfer.create(waveState.options)
    waveState.mdl.on('timeupdate', waveState.events.onWSTimeUpdate)
    waveState.mdl.on('seeking', waveState.events.onWSeeking)
    waveState.mdl.on('interaction', waveState.events.onWSInteraction)
    waveState.mdl.on('play', waveState.events.onWSplay)
    waveState.mdl.on('pause', waveState.events.onWSpause)
    waveState.mdl.on('finish', waveState.events.onWSfinish)
    waveState.mdl.on('click', waveState.events.onWSclick)
    waveState.mdl.on('drag', waveState.events.onWSdrag)
    waveState.mdl.on('scroll', waveState.events.onWSscroll)
    waveState.mdl.on('zoom', waveState.events.onWSzoom)
    return res({ dom, attrs, waveState })
})

const initWaveOptions = ({ waveOptions }) => {
    waveState.options = { ...waveState.options, ...waveOptions }
    waveState.events = { ...waveState.events, ...waveOptions.events }
}

export const Wave = ({ attrs: { waveOptions } }) => {
    initWaveOptions({ waveOptions })
    return {
        oncreate: ({ dom, attrs }) => attrs.onCreated(initWaveSurfer({ dom, attrs, waveState })),
        view: () =>
            m("section.wave-surfer"),
    }
}