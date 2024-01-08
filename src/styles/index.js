import { NoOp } from '@/Utils'
export * from './animations.js'

const duration = {
    duration: 700,
    easing: 'ease-in-out',
    fill: 'forwards',
}

function transitionEndPromise(element) {
    const transitionEnded = (e) => {
        if (e.target !== element) return
        element.removeEventListener('transitionend', transitionEnded)
    }
    return new Promise(() =>
        element.addEventListener('transitionend', transitionEnded)
    )
}

export const AnimatePage =
    (animation) =>
    ({ dom }) =>
        Animate(animation)({ dom })

export const Animate =
    (animation, pause = NoOp) =>
    ({ dom }) =>
        setTimeout(
            () =>
                dom
                    .animate(animation, duration)
                    .finished.then(transitionEndPromise(dom)),
            pause()
        )

export const AnimateChildren =
    (animation, pause) =>
    ({ dom }) => {
        let children = [...dom.children]

        children.map((child, idx) => {
            child.style.opacity = 0
            setTimeout(() => {
                child.style.opacity = 1
                Animate(animation)({ dom: child })
            }, pause())
        })
    }
