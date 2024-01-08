import m from "mithril";
import mockData from '../mock/data.json'
import { Audio, addRegion } from '@/components/audio'
import { Files } from '@/components/files'
import { uuid } from '@/Utils'

const newImageDto = () => ({ src: '', name: '', description: '', timeStart: 0, timeEnd: 5 })

const dismissModal = ({ playerState }) =>
  resetModalState({ playerState })

const resetModalState = ({ playerState }) => {
  playerState.img = newImageDto()
  playerState.modal = false
  if (playerState.fileInput) playerState.fileInput.value = ""
}

const saveFile = ({ mdl, playerState }) => {
  const imageDto = { ...playerState.img, uuid: uuid(), }
  playerState.images.push(imageDto)
  addRegion({ mdl, playerState, imageDto })
  dismissModal({ playerState })

}

const setImageSrcFromFile = ({ file }) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onerror = (e) => rej(e)
    reader.onload = () =>
      res({ src: reader.result })
    reader.readAsDataURL(file)
  })
}

const openModal = ({ playerState }) => ({ src }) => {
  playerState.img.src = src
  playerState.modal = true
  m.redraw()
  console.log(playerState)
}

const handleImageUpload = ({ playerState }) => ({ target: { files } }) => {
  // playerState.fileInput = e.target
  const file = files[0]
  playerState.img.name = file.name
  setImageSrcFromFile({ file }).then(openModal({ playerState }))
}

const Modal = {
  oninit: ({ attrs: { player
  } }) => resetModalState({ playerState }),
  view: ({ attrs: { mdl, playerState } }) =>
    m("ion-modal", { isOpen: playerState.modal, },
      m("ion-header",
        m("ion-toolbar",
          m("ion-buttons", { slot: "start" },
            m("ion-button", {
              onclick: e => dismissModal({ playerState })
            }, "Cancel")
          ),
          m("ion-title", "Add An Image or Video File"),
          m("ion-buttons", { slot: "end" },
            m("ion-button", { onclick: e => saveFile({ mdl, playerState }), strong: "true" },
              "Save")))
      ),
      m("ion-content", { fullscreen: true, class: "ion-padding" },
        m('form', {
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
            src: playerState.img.src, alt: playerState.img.name
          })
        )))
    )

}

const getSelectedOrCurrentlyPlayingImg = ({ mdl, playerState }) => {
  return playerState.recording.files > 0 ? playerState.recording.files[0].src : null
}

const Img = {
  view: ({ attrs: { mdl, playerState } }) =>
    m('.img-placeholder', m('img', { src: getSelectedOrCurrentlyPlayingImg({ mdl, playerState }) }))
}



const playerState = {
  recording: {},
  status: 'loading',
  activeRegion: null,
  modal: false,
  img: newImageDto(),
  images: [], //{src, uuid, name, description}
  regions: [], //{start, end, id, images:[uuid], content: canvas representation of the associated image uuids}
}


const fetchAudioAndFiles = ({ mdl, playerState }) => {
  playerState.recording = mockData.find(r => r.uuid == mdl.currentAudioUuid)

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
            oncancel: (e) => { console.log(e, playerState) },
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

        m(Modal, { mdl, playerState }),
        m(Audio, { mdl, playerState }),
        playerState.regions.length > 0 && [
          m(Img, { mdl, playerState }),
          m(Files, { mdl, playerState })
        ]
      )),
};
