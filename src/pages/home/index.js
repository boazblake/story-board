import m from "mithril";
import { isEmpty } from 'ramda'
import { Modal } from '@/components/modal.js'
import { uuid } from '../../Utils'
import tracks from '../../mock/tracks.json'

export const newAudio = () => ({
  name: '',
  uuid: uuid(),
  track: '',
  lastPosition: '',
  lastModified: 0,
})

const dismissModal = ({ state }) =>
  resetModalState({ state })

const resetModalState = ({ state }) => {
  state.audio = newAudio()
  state.showModal = false
  if (state.fileInput) state.fileInput.value = ""
  m.redraw()
}

const saveFile = ({ mdl, state }) => {
  state.tracks = state.tracks.concat([state.audio]);
  console.log('save file', state)
  resetModalState({ state })
}

const homeState =
{
  audio: newAudio(),
  showModal: false,
  tracks
}

const selectItem = ({ uuid }) => e => m.route.set(`/play/${uuid}`)

const getAudioSrcFromFile = ({ file, homeState }) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onerror = (e) => rej(e)
    reader.onload = () => {
      homeState.audio.track = reader.result
      homeState.audio.name = file.name
      homeState.audio.lastModified = file.lastModified
      return res({ homeState })
    }
    reader.readAsDataURL(file)
  })
}

const showModal = ({ homeState }) => { homeState.showModal = true; m.redraw() }

const handleAudioUpload = ({ homeState }) => ({ target: { files } }) => {
  const file = files[0]
  getAudioSrcFromFile({ file, homeState }).then(showModal)
}

export const Home = {
  view: ({ attrs: { mdl } }) =>
    m('ion-page',
      m('ion-header', m('ion-toolbar', m("label.file-upload", {
        slot: "end",
        for: 'audio-upload'
      }, m('input#audio-upload', {
        onchange: handleAudioUpload({ homeState }),
        name: 'file',
        label: "Select a File",
        labelPlacement: "stacked",
        type: "file",
        accept: ["audio/*"],
        style: { width: '150px' },
      }), 'Add Audio')
      )),
      m('ion-content', isEmpty(homeState.tracks)
        ? m('.row.justify-center.items-center', { style: { height: '100dvh' } }, m('ion-card', {
          color: 'light',
          style: { width: '50dvw' }
        },
          m('ion-card-header',
            m('ion-card-title', 'Add an Audio File to begin.'),

            m("label.file-upload", {
              for: 'audio-upload-two'
            }, m('input#audio-upload-two', {
              onchange: handleAudioUpload({ homeState }),
              name: 'file',
              label: "Select a File",
              labelPlacement: "stacked",
              type: "file",
              accept: ["audio/*"],
            }), 'Add Audio'
            )
          ))

        )
        :
        m("ion-list",
          homeState.tracks.map(item => m("ion-item",
            m("ion-thumbnail", { slot: "start" },
              m("img", { src: "your-image-url" })
            ),
            m("ion-label", item.name),
            m("ion-button", {
              slot: "end",
              fill: "clear",
              color: "primary",
            },
              m("ion-icon", { slot: "icon-only", name: "information-circle-outline" })
            ),
            m('ion-button', {
              slot: "end", fill: "clear",
              onclick: selectItem({ uuid: item.uuid })
            },
              m("ion-icon", {

                name: "chevron-forward-outline"
              }))

          )
          )
        ),

      ),
      m(Modal, { mdl, state: homeState, onConfirm: saveFile, onCancel: dismissModal, reset: resetModalState }, m('form', {
      }, m("ion-item",

        m("ion-input", {
          name: 'title',
          label: "Give it a title / leave blank to use the uploaded name",
          labelPlacement: "stacked",
          type: "text",
          placeholder: "Title",
          value: homeState.audio.name,
          oninput: ({ target: { value } }) => homeState.img.name = value
        }),

      ))),

    ),
};
