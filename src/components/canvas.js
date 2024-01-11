import m from 'mithril'


// import { traverse } from 'ramda'

// //compose
// // setCanvasSize({canvas}) => ({imgs}) => ({canvas, imgs})
// // loadImages ({base64Images})=> ({imgs}) 
// //

// const loadImages = ({ base64Images }) => Promise.all(base64Images.map(loadImage))


// const calcWidthHeight = imgs => imgs.reduce((ds, { height, width }) => {
//     ds[height] = ++height;
//     ds[width] = ++width;
//     return ds
// }, { width: 0, height: 0 })

// async function createCollage({ base64Images, canvas }) {

//     // Load the first image to get the size
//     loadImages({ base64Images })
//         .then(imgs => {
//             const { width, height } = calcWidthHeight(imgs)
//             return { imgs, width, height }
//         })
//         .then(({ imgs, width, height }) => {
//             canvas.width = width
//             canvas.height = height
//             const ctx = canvas.getContext('2d')
//             const size = Math.sqrt(base64Images.length)
//             const imgSize = canvas.width / size
//             return ({ ctx, size, imgSize, imgs })
//         })
//         .then(({ ctx, size, imgSize, imgs }) => imgs.forEach((img, i) => {
//             const x = (i % size) * imgSize
//             const y = Math.floor(i / size) * imgSize

//             // Calculate dimensions to preserve aspect ratio
//             let width, height
//             if (img.width > img.height) {
//                 width = imgSize
//                 height = imgSize * (img.height / img.width)
//             } else {
//                 height = imgSize
//                 width = imgSize * (img.width / img.height)
//             }

//             // Calculate position to center image within square
//             const posX = x + (imgSize - width) / 2
//             const posY = y + (imgSize - height) / 2

//             ctx.drawImage(img, posX, posY, width, height, posX, posY, width / 3, height / 3)

//             console.log(canvas)
//             return canvas

//         })


//         ).then(() => {
//             canvas.toBlob((blob) => {
//                 console.log(blob)
//                 const reader = new FileReader()
//                 reader.onloadend = () => resolve(reader.result)
//                 reader.readAsDataURL(blob)
//             })
//         })

// }

// function loadImage(dataUrl) {
//     return new Promise((resolve) => {
//         const img = new Image()
//         img.onload = () =>
//             resolve(img)
//         img.src = dataUrl
//     })
// }

async function createCollage({ base64Images, canvas }) {
    // Load the first image to get the size
    const firstImage = await loadImage(base64Images[0]);

    // Set the canvas size to match the image size
    canvas.width = firstImage.width;
    canvas.height = firstImage.height;
    const ctx = canvas.getContext('2d');
    const size = Math.sqrt(base64Images.length);
    const imgSize = canvas.width / size;

    for (let i = 0; i < base64Images.length; i++) {
        const img = await loadImage(base64Images[i]);
        const x = (i % size) * imgSize;
        const y = Math.floor(i / size) * imgSize;

        // Calculate dimensions to preserve aspect ratio
        let width, height;
        if (img.width > img.height) {
            width = imgSize;
            height = imgSize * (img.height / img.width);
        } else {
            height = imgSize;
            width = imgSize * (img.width / img.height);
        }

        // Calculate position to center image within square
        const posX = x + (imgSize - width) / 2;
        const posY = y + (imgSize - height) / 2;

        ctx.drawImage(img, posX, posY, width, height, posX, posY, width / 3, height / 3);
    }

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    });
}

function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}


export const canvasRepresentationOfImage = ({ imageDto }) => {
    // content.uuid = imageDto.uuid
    // content.alt = imageDto.name

    const calcWidthHeight = (w, h) => {
        const width = 100

        // Calculate the new height while maintaining the aspect ratio
        const height = (h / w) * width

        return { width, height }
    }

    var canvas = document.createElement('canvas')
    const { width, height } = calcWidthHeight(imageDto.width, imageDto.height)
    canvas.width = width
    canvas.height = height
    canvas['data-uuid'] = imageDto.uuid
    var ctx = canvas.getContext('2d')
    var img = new Image(imageDto.src)
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    img.src = imageDto.src
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

    if (currentImageUuids.toString() == canvasState.currentImageUuidString) return

    canvasState.currentImageUuidString = currentImageUuids.toString()

    const base64Images = playerState.images
        .filter(i => currentImageUuids.includes(i.uuid))
        .map(i => i.src)
    // .map(imageDto => canvasRepresentationOfImage({ imageDto }))
    // .map(log('cv'))
    createCollage({ base64Images, canvas: dom })
    // createSquareMontage({ canvases, dom })
}


const canvasState = {
    currentImageUuidString: ""
}

export const Canvas = {
    view: ({ attrs: { mdl, playerState } }) =>
        m('.', m('canvas', {
            onupdate: getSelectedOrCurrentlyPlayingImgs({ playerState }),
            oncreate: getSelectedOrCurrentlyPlayingImgs({ playerState })
        }))
}
