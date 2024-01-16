import m from 'mithril'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Task from 'data.task'
import http from '@/utils/http'
import { randomColor } from '@/utils/index'
import { compose, prop } from 'ramda'

export const onWSTimeUpdate = ({ playerState }) => (currentTime) => {
    playerState.currentTime = currentTime

    const currentlyPlayingRegions = region => {
        return playerState.currentTime >= region.start && playerState.currentTime <= region.end
    }

    playerState.activeRegions = playerState.regions.filter(currentlyPlayingRegions)
    m.redraw()
}

export const onWSeeking = ({ mdl, playerState }) => (currentTime) => {
    playerState.currentTime = currentTime

    const currentlyPlayingRegions = region => playerState.currentTime >= region.start && playerState.currentTime <= region.end

    playerState.activeRegions = playerState.regions.filter(currentlyPlayingRegions)
    m.redraw()
}

export const onWSInteraction = ({ playerState }) =>
    (currentTime) => {
        playerState.currentTime = currentTime

        const currentlyPlayingRegions = region => playerState.currentTime >= region.start && playerState.currentTime <= region.end

        playerState.activeRegions = playerState.regions.filter(currentlyPlayingRegions)
        m.redraw()
    }

export const onWSZoom = _ => ({ audioState, minPxPerSec }) => {
    audioState.ws.mdl.zoom(minPxPerSec)
    m.redraw()
}


export const initTimeLine = ({ attrs, waveState, dom }) => {
    attrs.audioState.ws = waveState
    waveState.timeline = waveState.mdl.registerPlugin(Timeline.create({
        height: 10,
        insertPosition: 'beforebegin',
        timeInterval: 0.2,
        primaryLabelInterval: 5,
        primaryLabelInterval: 1,
        style: {
            fontSize: '10px',
            color: '#2D5B88',
        },
    }))
    // waveState.mdl.timeline.on("timeline-clicked", (log('time-clicked'), m.redraw()))

    return ({ attrs, waveState, dom })
}


export const initRegions = ({ attrs, waveState, dom }) => {
    waveState.mdl.regions = waveState.mdl.registerPlugin(Regions.create())

    waveState.mdl.regions.enableDragSelection({
        color: 'rgba(255, 0, 0, 0.1)',
    })

    waveState.mdl.regions.on('region-updated', (region) => {
        //update region
        attrs.playerState.regions = attrs.playerState.regions.filter(r => r.id !== region.id).concat([region])
        m.redraw()
    })
    waveState.mdl.regions.on('region-clicked', (region, e) => {
        e.stopPropagation() // prevent triggering a click on the waveform
        attrs.playerState.activeRegions = region
        region.play()
        region.setOptions({ color: randomColor() })
        attrs.playerState.activeRegions = region
        m.redraw()
    })
    return { attrs, waveState, dom }
}

const findImageFromRegion = ({ images }) => region => {
    const imageDto = images.find(image => image.uuid == region.content['data-uuid'])

    return { imageDto, region }
}


const reinsertRegion = ({ mdl }) => ({ imageDto, region }) => {
    addRegion({ mdl, imageDto, options: region })
    console.log(mdl)
}

const insertSavedRegion = ({ mdl, images }) => compose(reinsertRegion({ mdl }), findImageFromRegion({ images }))

export const onDecoded = ({ attrs, waveState, dom }) => {
    waveState.mdl.on('decode', () => {
        attrs.audioState.ws.status = 'loaded'
    })
    return { attrs, waveState, dom }
}

export const onLoaded = ({ attrs, waveState, dom }) => {
    waveState.mdl.on('ready', () => {
        attrs.playerState.regions.forEach(insertSavedRegion({ mdl: attrs.mdl, images: attrs.playerState.images }))
        attrs.playerState.status = 'loaded'
        waveState.status = 'loaded'
    })
    return ({ attrs, waveState, dom })
}

const byTrackId = ({ objectId }) => ({ trackId: { __type: "Pointer", className: "Tracks", objectId: `${objectId}` } })


export const newImageDto = ({ trackObjectId }) => ({
    src: "", // base64 encoded image data
    description: "",
    size: 0, // size of the image file in bytes
    width: 0, // width of the image
    height: 0, // height of the image
    trackObjectId
})

export const getImageSrcNameSizeFromFile = ({ file }) => {
    return new Promise((res, rej) => {
        const reader = new FileReader()
        reader.onerror = (e) => rej(e)
        reader.onload = () => {
            const img = {
                src: reader.result,//.split(';base64,').pop(),
                name: file.name,
                size: file.size,
            }
            return res({ img })
        }
        reader.readAsDataURL(file)
    })
}

const byWhereClause = ({ objectId }) =>
    `?where=${encodeURIComponent(JSON.stringify(byTrackId({ objectId })))}`


const fetchAudioTask = ({ mdl }) => http.B4A.getTask(mdl)(`tracks/${mdl.currentTrackId}`).map(prop('results'))

const fetchImagesTask = ({ mdl }) => http.B4A.getTask(mdl)(`images/${byWhereClause({ objectId: mdl.currentTrackId })}`).map(prop('results'))


const fetchRegionsTask = ({ mdl }) => http.B4A.getTask(mdl)(`regions/${byWhereClause({ objectId: mdl.currentTrackId })}`).map(prop('results'))


export const fetchAudioImagesAndRegions = ({ mdl }) =>
    Task.of(audio => images => regions => ({ audio, images, regions }))
        .ap(fetchAudioTask({ mdl }))
        .ap(fetchImagesTask({ mdl }))
        .ap(fetchRegionsTask({ mdl }))