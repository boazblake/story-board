import m from "mithril";
import mockData from '../mock/data.json'
import { Audio, addRegion } from '@/components/audio'
import { Files } from '@/components/files'
import { uuid } from '@/Utils'

const newImageDto = () => ({ width: 100, height: 140, src: '', name: '', description: '', timeStart: 0, timeEnd: 5 })

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

const setImageSrcFromFile = ({ file, playerState }) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onerror = (e) => rej(e)
    reader.onload = () => {
      playerState.img.src = reader.result
      playerState.img.name = file.name
      // console.log(playerState, file)
      return res({ playerState })
    }
    reader.readAsDataURL(file)
  })
}

const openModal = ({ playerState }) => {
  playerState.modal = true
  m.redraw()
}

const handleImageUpload = ({ playerState }) => ({ target: { files } }) => {
  const file = files[0]
  setImageSrcFromFile({ file, playerState }).then(openModal)
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
            onload: ({ target: { width, height } }) => { playerState.img.width = width; playerState.img.height = height },
            src: playerState.img.src, alt: playerState.img.name
          })
        )))
    )

}

function createSquareMontage({ canvases, dom }) {
  // Calculate the number of rows and columns for the square montage
  var size = Math.ceil(Math.sqrt(canvases.length));
  console.log
  // Create a new canvas for the montage
  var montageCanvas = dom;
  montageCanvas.width = size * 100; // assuming each image is 100px wide

  // Get the context for the montage canvas
  var ctx = montageCanvas.getContext('2d');

  // Draw each canvas image onto the montage canvas in a square arrangement
  var x = 0;
  var y = 0;
  var maxHeight = 0;
  canvases.forEach(function (canvas, i) {
    ctx.drawImage(canvas, x, y, 100, canvas.height); // set width to 100px

    // Update the max height in the current row
    maxHeight = Math.max(maxHeight, canvas.height);

    // Move to the next column
    x += 100; // fixed width

    // Move to the next row after every 'size' images
    if ((i + 1) % size === 0) {
      x = 0;
      y += maxHeight;
      maxHeight = 0; // reset for the next row
    }
  });

  // Adjust the height of the montage canvas to fit the images
  montageCanvas.height = y + maxHeight;
  console.log(montage)

}

const getSelectedOrCurrentlyPlayingImgs = ({ playerState }) => ({ dom }) => {
  const canvases = playerState.activeRegions.map(r => r.content)
  createSquareMontage({ canvases, dom })
  // return playerState.recording.files > 0 ? playerState.recording.files[0].src : null
}

const Img = {
  view: ({ attrs: { mdl, playerState } }) =>
    m('.img-placeholder', m('canvas', { oncreate: getSelectedOrCurrentlyPlayingImgs({ playerState }) }))
}



const playerState = {
  recording: {},
  status: 'loading',
  activeRegions: [],
  currentTime: 0,
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
        playerState.activeRegions.length > 0 && m(Img, { mdl, playerState }),
        playerState.regions.length > 0 && m(Files, { mdl, playerState })

      )),
};
