import m from "mithril"
import { PlayerModal } from './modal.js'
import { Audio } from './audio.js'
import { Canvas } from '@/components/canvas'
import { Files } from '@/components/files'
import { fetchAudioImagesAndRegions, } from './model.js'
import { log } from '@/utils/index'


const playerState = {
  trackObjectId: "",
  audio: {},
  status: 'loading',
  activeRegions: [],
  newRegionId: null,
  currentTime: 0,
  showModal: false,
  img: {},
  images: [], //{src, uuid, name, description}
  regions: [], //{start, end, id, images:[uuid], content: canvas representation of the associated image uuids}
}


const hasActiveRegions = ({ playerState }) => {
  while (playerState.activeRegions.length > 0) {
    return true
  }
}


const hasRegions = ({ playerState }) => {
  while (playerState.regions.length > 0) {
    return true
  }
}


const load = ({ mdl }) => {
  const onError = log('player-load-e')
  const onSuccess = ({ audio, images, regions }) => {
    playerState.images = images
    playerState.regions = regions
    playerState.audio = audio
    playerState.status = 'loaded'
  }

  fetchAudioImagesAndRegions({ mdl }).fork(onError, onSuccess)
}


export const Player = {
  oninit: ({ attrs: { mdl } }) => {
    playerState.status = 'loading'
    playerState.trackObjectId = mdl.currentTrackId
    load({ mdl })
  },
  view: ({ attrs: { mdl } }) =>
    m('ion-page',
      playerState.status == 'loaded' && m('ion-header',
        m('ion-toolbar',
          m('ion-button', {
            fill: 'outline',
            slot: "start",
            onclick: () => m.route.set('/')
          }, 'Back'),
        )),
      playerState.status == 'loaded' && m('ion-content',
        { fullscreen: true, class: "ion-padding" },

        m(PlayerModal, { mdl, playerState }),

        m(Audio, { mdl, playerState }),
        hasActiveRegions({ playerState }) && m(Canvas, { mdl, playerState }),
        m(Files, { mdl, playerState })

      ),
      playerState.status == 'loading' && m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Fetching Track, Images and regions'))
}
