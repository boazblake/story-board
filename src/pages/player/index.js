import m from "mithril"
import { PlayerModal, openModal } from './modal.js'
import { Audio } from './audio.js'
import { addRegion } from '@/components/wave'
import { Canvas } from '@/components/canvas'
import { Files } from '@/components/files'
import { fetchAudioImagesAndRegions, newImageDto, getImageSrcNameSizeFromFile } from './model.js'
import { log } from '@/utils/index'


const playerState = {
  trackObjectId: "",
  audio: {},
  status: 'loading',
  activeRegions: [],
  currentTime: 0,
  showModal: false,
  img: {},
  images: [], //{src, uuid, name, description}
  regions: [], //{start, end, id, images:[uuid], content: canvas representation of the associated image uuids}
}




const handleImageUpload = ({ playerState }) => ({ target: { files } }) => {
  const file = files[0]
  getImageSrcNameSizeFromFile({ file })
    .then(({ img }) => {
      playerState.img = { ...newImageDto(playerState), ...img }
      return { playerState }
    })
    .then(openModal)
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
  view: ({ attrs: { mdl } }) => {
    console.log('view - showModal', playerState.showModal); return playerState.status == 'loaded' ? m('ion-page',
      m('ion-header',
        m('ion-toolbar',
          m('ion-button', {
            fill: 'outline',
            slot: "start",
            onclick: () => m.route.set('/')
          }, 'Back'),

          m("label.file-upload", {
            slot: "end",
            for: 'file-upload'
          },
            m('input#file-upload', {
              onchange: handleImageUpload({ playerState }),
              oncancel: () => { },
              name: 'file',
              label: 'Add Image',
              labelPlacement: "stacked",
              type: "file",
              accept: ["image/*", "video/*"],
              style: { width: '150px' },
            }), 'Add Image')),
      ),
      m('ion-content',
        { fullscreen: true, class: "ion-padding" },

        playerState.showModal && m(PlayerModal, { mdl, playerState }),

        m(Audio, { mdl, playerState }),
        hasActiveRegions({ playerState }) && m(Canvas, { mdl, playerState }),
        hasRegions({ playerState }) && m(Files, { mdl, playerState })

      ))
      : m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Fetching Track, Images and regions')
  },
}
