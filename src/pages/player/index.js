import m from "mithril"
import { PlayerModal, openModal } from './player-modal.js'
import { Audio, addRegion } from '@/components/audio'
import { Canvas } from '@/components/canvas'
import { Files } from '@/components/files'
import tracks from '../../mock/tracks.json'
// import images from '../../mock/images.json'
// import regions from '../../mock/regions.json'

const playerState = {
  audio: null,
  status: 'loading',
  activeRegions: [],
  currentTime: 0,
  showModal: false,
  // img: newImageDto(),
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
    .then(({ img }) => { playerState.img = { ...playerState.img, ...img }; return { playerState } })
    .then(res => (playerState.showModal = true, res))
    .then(openModal)
}




const fetchAudioAndFiles = ({ mdl, playerState }) => {
  playerState.audio = tracks[0]
  playerState.images = []//images
  playerState.regions = []//regions
  playerState.status = 'loaded'
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


export const Player = {
  oninit: ({ attrs: { mdl } }) => {
    playerState.status = 'loading'
    fetchAudioAndFiles({ mdl, playerState })
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

        m(Audio, { mdl, playerState }),
        hasActiveRegions({ playerState }) && m(Canvas, { mdl, playerState }),
        hasRegions({ playerState }) && m(Files, { mdl, playerState })

      )),
}
