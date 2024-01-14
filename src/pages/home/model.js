import { prop } from 'ramda'
import http from '@/utils/http.js'

export const fetchTracksTask = ({ mdl }) => http.B4A.getTask(mdl)('tracks').map(prop('results'))

export const saveTrackTask = ({ mdl, track }) =>
    http.B4A.postTask(mdl)('tracks')(track)


export const newTrack = () => ({
    name: '',
    track: '',
    lastPosition: 0,
    lastModified: "",
    type: "",
    size: 0
})
