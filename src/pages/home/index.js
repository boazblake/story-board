import m from "mithril"
import { isEmpty } from 'ramda'
import { Modal } from '@/components/modal.js'
import { fetchTracksTask, saveTrackTask, newTrack } from './model.js'
import { log } from '@/utils/index'



const created = ({ attrs, dom }) => {
  attrs.dom = dom
}

const resetForm = ({ attrs }) => {
  attrs.state.track = newTrack()
  if (attrs.state.fileInput) attrs.state.fileInput.value = ""
}

const closeModal = (attrs) => {
  resetForm({ attrs })
  attrs.dom.isOpen = false
  attrs.state.showModal = false
}

const saveFile = (attrs) => {
  attrs.state.status = 'saving'
  const onSuccess = _ => { closeModal(attrs); load({ mdl: attrs.mdl }) }
  const onError = log('home-saveFile')
  saveTrackTask({ mdl: attrs.mdl, track: attrs.state.track }).fork(onError, onSuccess)

}

const homeState =
{
  status: 'loading',
  track: newTrack(),
  showModal: false,
  tracks: []
}

const selectItem = ({ objectId }) => e => m.route.set(`/play/${objectId}`)

const deleteItem = ({ item }) => console.log(item)

const audioFileToTrackDto = ({ file }) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onerror = (e) => rej(e)
    reader.onload = () =>
      res({
        track: reader.result.split(';base64,').pop(),
        name: file.name,
        lastModified: file.lastModified,
        type: file.type,
        size: file.size
      })

    reader.readAsDataURL(file)
  })
}

const showModal = ({ homeState }) => {
  homeState.showModal = true
  m.redraw()
}

const handleAudioUpload = ({ homeState }) => ({ target: { files } }) => {
  const file = files[0]
  audioFileToTrackDto({ file }).then(track => { homeState.track = { ...homeState.track, ...track }; return { homeState } }).then(showModal)
}

const load = ({ mdl }) => {

  const onSuccess = (tracks) => {
    homeState.tracks = tracks
    homeState.status = 'loaded'
  }

  const onError = log('home-fetchTracksTask')

  fetchTracksTask({ mdl }).fork(onError, onSuccess)
}



export const Home = ({ attrs: { mdl } }) => {
  load({ mdl })
  return {
    view: ({ attrs: { mdl } }) => m('ion-page',
      m('ion-header', m('ion-toolbar', m("label.file-upload", {
        slot: "end",
        for: 'audio-upload'
      }, m('input#audio-upload', {
        onchange: handleAudioUpload({ homeState }),
        name: 'file',
        label: "Select a File",
        labelPlacement: "stacked",
        type: "file",
        accept: ["audio/*,audio/m4a"],
        style: { width: '150px' },
      }), 'Add Audio')
      )),
      m('ion-content',

        homeState.status == 'loading'
          ? m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Fetching Tracks')
          : isEmpty(homeState.tracks)
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
                  m("ion-icon", { slot: "icon-only", name: "information-circle-outline", onclick: e => deleteItem({ item }) })
                ),
                m('ion-button', {
                  slot: "end", fill: "clear",
                  onclick: selectItem({ objectId: item.objectId })
                },
                  m("ion-icon", {

                    name: "chevron-forward-outline"
                  }))

              )
              )
            )
      ),
      homeState.showModal ?
        m(Modal, {
          mdl,
          onConfirm: saveFile,
          onCancel: closeModal,
          onCreated: created,
          state: homeState,
        },

          homeState.status == 'saving' && m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Saving Track'),


          homeState.status == 'loaded' && m('form', {
          }, m("ion-item",
            m("ion-input", {
              name: 'title',
              label: "Give it a title / leave blank to use the uploaded name",
              labelPlacement: "stacked",
              type: "text",
              placeholder: "Title",
              value: homeState.track.name,
              oninput: ({ target: { value } }) => homeState.track.name = value
            }),

          ))) : null,

    )
  }
}
