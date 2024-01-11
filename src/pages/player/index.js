import m from "mithril"
import { Audio, addRegion } from '@/components/audio'
import { Canvas } from '@/components/canvas'
import { Files } from '@/components/files'
import { Modal } from '@/components/modal'
import { uuid } from '@/Utils'
import tracks from '../../mock/tracks.json'
import images from '../../mock/images.json'
import regions from '../../mock/regions.json'

const newImageDto = () => ({ size: 0, width: 100, height: 140, src: '', name: '', description: '', })

const dismissModal = ({ state }) =>
  resetModalState({ state })

const resetModalState = ({ state }) => {
  state.img = newImageDto()
  state.showModal = false
  if (state.fileInput) state.fileInput.value = ""
}

const saveFile = ({ mdl, state, }) => {
  const imageDto = { ...state.img, uuid: uuid(), }
  state.images.push(imageDto)
  const options = { start: 0, end: 5 }
  addRegion({ mdl, imageDto, options }).then(region => state.regions.push(region))

  dismissModal({ state })
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

const openModal = ({ playerState }) => {
  playerState.showModal = true
  m.redraw()
}

const handleImageUpload = ({ playerState }) => ({ target: { files } }) => {
  const file = files[0]
  getImageSrcNameSizeFromFile({ file }).then(({ img }) => { playerState.img = { ...playerState.img, ...img }; return { playerState } }).then(log('wtf')).then(openModal)
}

const playerState = {
  audio: null,
  status: 'loading',
  activeRegions: [],
  currentTime: 0,
  showModal: false,
  img: newImageDto(),
  images: [], //{src, uuid, name, description}
  regions: [], //{start, end, id, images:[uuid], content: canvas representation of the associated image uuids}
}


const fetchAudioAndFiles = ({ mdl, playerState }) => {
  playerState.audio = tracks[0]
  playerState.images = images
  playerState.regions = regions
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
          }, m('input#file-upload', {
            onchange: handleImageUpload({ playerState }),
            name: 'file',
            label: "Select a File",
            labelPlacement: "stacked",
            type: "file",
            accept: ["image/*", "video/*"],
            style: { width: '150px' },
          }), 'Add Image')),
      ),
      m('ion-content',
        { fullscreen: true, class: "ion-padding" },

        m(Modal, { mdl, state: playerState, onConfirm: saveFile, onCancel: dismissModal, reset: resetModalState }, m('form', {
        }, m("ion-item",

          m("ion-input", {
            name: 'title',
            label: "Give it a title / leave blank to use the uploaded name",
            labelPlacement: "stacked",
            type: "text",
            placeholder: "Title",
            value: playerState.img.name,
            oninput: ({ target: { value } }) => playerState.img.name = value
          }),
          m("ion-textarea", {
            name: 'description',
            label: "Detailed description",
            labelPlacement: "stacked",
            type: "text",
            placeholder: "Detailed Description",
            value: playerState.img.description,
            oninput: ({ target: { value } }) => playerState.img.description = value
          }),
          m('img', {
            onload: ({ target: { width, height } }) => {
              playerState.img.width = width
              playerState.img.height = height
            },
            src: playerState.img.src, alt: playerState.img.name
          })
        ))),
        m(Audio, { mdl, playerState }),
        hasActiveRegions({ playerState }) && m(Canvas, { mdl, playerState }),
        hasRegions({ playerState }) && m(Files, { mdl, playerState })

      )),
}
