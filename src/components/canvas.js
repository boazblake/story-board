import m from 'mithril'

export const canvasRepresentationOfImage = ({ imageDto }) => {
    // content.uuid = imageDto.uuid
    // content.alt = imageDto.name

    const calcWidthHeight = (w, h) => {
        const width = 100;

        // Calculate the new height while maintaining the aspect ratio
        const height = (h / w) * width

        return { width, height }
    }

    var canvas = document.createElement('canvas');
    const { width, height } = calcWidthHeight(imageDto.width, imageDto.height)
    canvas.width = width;
    canvas.height = height;
    canvas['data-uuid'] = imageDto.uuid
    var ctx = canvas.getContext('2d');
    var img = new Image(imageDto.src);
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    img.src = imageDto.src;
    return canvas
}


const getImageData = (canvas) => {
    const ctx = canvas.getContext('2d')
    console.log(ctx.getImageData(0, 0, canvas.width, canvas.height))
    return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

export const createMontageOnDom = ({ canvases }) => ({ dom }) => {
    console.log(canvases, dom)
    const ctx = dom.getContext('2d')

    // Clear the target canvas
    ctx.clearRect(0, 0, dom.width, dom.height)

    // Get ImageData from each canvas and put it onto the target canvas
    canvases.map(getImageData).forEach((imageData, index) =>
        ctx.drawImage(imgData, 0, 0, imageData.width, imageData.height)
        //ctx.putImageData(imageData, index * imageData.width, 0)
    )
}

const getSelectedOrCurrentlyPlayingImgs = ({ playerState }) => ({ dom }) => {
    const currentImageUuids = playerState.activeRegions.map(r => r.content['data-uuid'])
    const canvases = playerState.images
        .filter(i => currentImageUuids.includes(i.uuid))
        .map(imageDto => canvasRepresentationOfImage({ imageDto }))
        .map(log('?'))
        .map(createMontageOnDom({ dom }))
}

export const Canvas = {
    view: ({ attrs: { mdl, playerState } }) =>
        m('.canvas-placeholder', m('canvas', {
            onupdate: getSelectedOrCurrentlyPlayingImgs({ playerState }),
            oncreate: getSelectedOrCurrentlyPlayingImgs({ playerState })
        }))
}
