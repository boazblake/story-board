import m from "mithril"
import { PlayerModal, openModal } from './player-modal.js'
import { Audio } from './audio.js'
import { addRegion } from '@/components/wave'
import { Canvas } from '@/components/canvas'
import { Files } from '@/components/files'
import { fetchAudioImagesAndRegions } from './model.js'
import { log } from '@/utils/index'


const playerState = {
  trackId: "",
  audio: {},
  status: 'loading',
  activeRegions: [],
  currentTime: 0,
  showModal: false,
  img: {},
  images: [], //{src, uuid, name, description}
  regions: [], //{start, end, id, images:[uuid], content: canvas representation of the associated image uuids}
}

const getImageSrcNameSizeFromFile = ({ file }) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onerror = (e) => rej(e)
    reader.onload = () => {
      const img = {
        src: reader.result,
        name: file.name,
        size: file.size,
      }
      return res({ img })
    }
    reader.readAsDataURL(file)
  })
}



const handleImageUpload = ({ playerState }) => ({ target: { files } }) => {
  const file = files[0]
  getImageSrcNameSizeFromFile({ file })
    .then(({ img }) => { playerState.img = { ...newImageDto(objectId), ...img }; return { playerState } })
    .then(res => (playerState.showModal = true, res))
    .then(openModal)
}




const fetchAudioAndFiles = ({ mdl, playerState }) => {
  playerState.audio = tracks[0]
  playerState.images = []//images
  playerState.regions = []//regions
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
    playerState.TrackId = mdl.currentTrackId
    load({ mdl })
  },
  view: ({ attrs: { mdl } }) =>
    m('ion-page',
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

        playerState.status == 'loaded' && m(Audio, { mdl, playerState }),
        hasActiveRegions({ playerState }) && m(Canvas, { mdl, playerState }),
        hasRegions({ playerState }) && m(Files, { mdl, playerState })

      )),
}
