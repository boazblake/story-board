import m from 'mithril'
import { Modal } from '@/components/modal'
import { Wave } from '@/components/wave'
import { log } from '@/utils/index'
// import { addRegion } from '@/components/audio'


const newImageDto = ({ trackObjectId }) => ({ size: 0, width: 100, height: 140, src: '', name: '', description: '', trackObjectId })

const resetModalState = ({ playerState }) => {
    playerState.img = {}// newImageDto({ trackObjectId: playerState.currentTrackId })
    if (playerState.fileInput) playerState.fileInput.value = ""
    playerState.showModal = false
    m.redraw()
    console.log('resetmodal', playerState.showModal, playerState)
}

const saveFile = ({ mdl, playerState }) => {
    //chain save imageDTo
    //      save region 
    const imageDto = { ...playerState.img }
    // playerState.images.push(imageDto)
    const options = { start: 0, end: 5 }
    // addRegion({ mdl, imageDto, options }).then(region => playerState.regions.push(region))
    console.log('saveFile', mdl, playerState, imageDto)

    resetModalState({ playerState })
}

export const openModal = ({ playerState }) => {
    //    playerState.img = { ...playerState.img, ...playerState.img }
    playerState.showModal = true
    console.log('???', playerState.showModal, playerState)
    m.redraw()
}


export const PlayerModal = ({ attrs: { playerState } }) => {


    return {
        // onremove: e => { console.log('remove', e) },
        view: ({ attrs: { mdl, playerState } }) =>
            m(Modal, {
                mdl,
                onConfirm: e => saveFile({ mdl, playerState }),
                onCancel: e => resetModalState({ mdl, playerState }),
                reset: e => resetModalState({ playerState }),
                state: playerState
            }, m('form', {
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

                // m(Wave, {
                //     waveOptions: { url: `data:audio/mp3;base64,${playerState.audio.track}` },
                //     onCreated
                // }),

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
                        console.log('img loaded')
                    },
                    src: playerState.img.src, alt: playerState.img.name
                })
            )))
    }
}