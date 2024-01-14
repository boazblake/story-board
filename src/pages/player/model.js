import Task from 'data.task'
import { prop } from 'ramda'
import http from '@/utils/http'
import { log } from '@/utils'

const byTrackId = ({ objectId }) => ({ trackId: { __type: "Pointer", className: "Tracks", objectId: `${objectId}` } })

export const newImageDto = ({ objectId }) => ({
    src: "", // base64 encoded image data
    description: "",
    size: 0, // size of the image file in bytes
    width: 0, // width of the image
    height: 0, // height of the image
    trackId: byTrackId({ objectId })
})

const byWhereClause = ({ objectId }) =>
    `?where=${encodeURIComponent(JSON.stringify(byTrackId({ objectId })))}`


const fetchAudioTask = ({ mdl }) => http.B4A.getTask(mdl)(`tracks/${mdl.currentTrackId}`).map(prop('results')).map(log('wtf'))

const fetchImagesTask = ({ mdl }) => http.B4A.getTask(mdl)(`images/${byWhereClause({ objectId: mdl.currentTrackId })}`).map(prop('results'))


const fetchRegionsTask = ({ mdl }) => http.B4A.getTask(mdl)(`regions/${byWhereClause({ objectId: mdl.currentTrackId })}`).map(prop('results'))


export const fetchAudioImagesAndRegions = ({ mdl }) =>
    Task.of(audio => images => regions => ({ audio, images, regions }))
        .ap(fetchAudioTask({ mdl }))
        .ap(fetchImagesTask({ mdl }))
        .ap(fetchRegionsTask({ mdl }))