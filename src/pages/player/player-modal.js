import m from 'mithril'
import { Modal } from '@/components/modal'
import { Wave } from '@/components/wave'
import { addRegion } from '@/components/audio'
import { uuid } from '@/Utils'


const newImageDto = () => ({ size: 0, width: 100, height: 140, src: '', name: '', description: '', })

const dismissModal = ({ state, playerState }) => {
    resetModalState({ state })
    playerState.showModal = false
}

const resetModalState = ({ state, playerState }) => {
    state.img = newImageDto()
    state.showModal = false
    if (state.fileInput) state.fileInput.value = ""
}

const saveFile = ({ mdl, state, }) => {
    //chain save imageDTo
    //      save region 
    const imageDto = { ...state.img, uuid: uuid(), }
    // state.images.push(imageDto)
    const options = { start: 0, end: 5 }
    // addRegion({ mdl, imageDto, options }).then(region => state.regions.push(region))
    console.log(mdl, state)
    dismissModal({ state, playerState })
}

export const openModal = ({ playerState: { img } }) => {
    state.img = { ...state.img, ...img }
    state.showModal = true
    // console.log(state)
    m.redraw()
}

const state = {
    showModal: false,
    img: newImageDto()
}

const onCreatedWave = log('wtf')

export const PlayerModal = {
    view: ({ attrs: { mdl, playerState } }) =>
        m(Modal, {
            mdl,
            state,
            onConfirm: e => saveFile({ mdl, state, e }),
            onCancel: e => dismissModal({ mdl, state, e }),
            reset: e => resetModalState({ state, playerState })
        }, m('form', {
        }, m("ion-item",

            m("ion-input", {
                name: 'title',
                label: "Give it a title / leave blank to use the uploaded name",
                labelPlacement: "stacked",
                type: "text",
                placeholder: "Title",
                value: state.img.name,
                oninput: ({ target: { value } }) => state.img.name = value
            }),

            m(Wave, {
                waveOptions: { url: playerState.audio.track },
                onCreatedWave
            }),

            m("ion-textarea", {
                name: 'description',
                label: "Detailed description",
                labelPlacement: "stacked",
                type: "text",
                placeholder: "Detailed Description",
                value: state.img.description,
                oninput: ({ target: { value } }) => state.img.description = value
            }),

            m('img', {
                onload: ({ target: { width, height } }) => {
                    state.img.width = width
                    state.img.height = height
                },
                src: state.img.src, alt: state.img.name
            })
        )))
}