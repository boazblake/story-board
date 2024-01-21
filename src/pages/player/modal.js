import m from 'mithril'
import { Modal } from '@/components/modal'
import { Wave } from '@/components/wave'
import { byTrackObjectId, uploadImageTask, uploadRegionTask } from './model'
import { log } from '@/utils'
import { canvasRepresentationOfImage } from '@/components/canvas'

const modalState = {
    status: 'loaded',
    dom: null
}



const newImageDto = ({ trackObjectId }) => ({ size: 0, width: 100, height: 140, src: '', name: '', description: '', trackObjectId })


const resetForm = (attrs) => {
    attrs.state.img = newImageDto({ trackObjectId: attrs.state.currentTrackId })
    if (attrs.state.fileInput) attrs.state.fileInput.value = ""
}

const closeModal = attrs => {
    resetForm(attrs)
    modalState.dom.isOpen = false
    attrs.state.showModal = false
}

const updateRegionWithImage = (attrs, imageDto) => ({ results: { objectId } }) => {
    imageDto.objectId = objectId
    attrs.state.images.push(imageDto)
    const region = attrs.state.ws.mdl.regions.regions.find(r => r.id == attrs.state.newRegionId)
    region.setContent(canvasRepresentationOfImage({ imageDto }))
    attrs.state.regions.push(region)
    return region
}

const saveFile = (attrs) => {
    modalState.status = 'saving'

    const imageDto = { ...attrs.state.img, trackObjectId: byTrackObjectId({ objectId: attrs.state.trackObjectId }) }

    const onSuccess = ({ results: { objectId } }) => {
        modalState.status = 'loaded'
        closeModal(attrs)
        m.redraw()
        console.log(attrs, objectId)
    }

    uploadImageTask(attrs.mdl, imageDto)
        .map(updateRegionWithImage(attrs, imageDto))
        .chain(uploadRegionTask(attrs))
        .fork(log('e'), onSuccess)

}

export const openModal = ({ playerState }) => {
    playerState.showModal = true
    m.redraw()
}


export const PlayerModal = {
    view: ({ attrs: { mdl, playerState } }) =>
        playerState.showModal && m(Modal, {
            mdl,
            onConfirm: saveFile,
            onCancel: closeModal,
            state: playerState,
            onCreated: ({ dom }) => modalState.dom = dom,
        },

            modalState.status == 'loaded' && m('form', {
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
                //     waveOptions: { url: `data:audio/mp3;base64,${playerState.audio.track}`, width: '500px', mediaControls: false },
                //     onCreated: log('?')
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
                    },
                    src: playerState.img.src, alt: playerState.img.name
                })
            )),
            modalState.status == 'saving' && m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Saving Image')
        )
}