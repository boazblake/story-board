export const popIn = [
  {
    transform: "scale(0)",
    opacity: 1,
  },
  {
    transform: "scale(1)",
    opacity: 1,
  },
  {
    transform: "scale(0.8)",
    opacity: 1,
  },
  {
    transform: "scale(1)",
    opacity: 1,
  },
]

export const fadeIn = [
  {
    opacity: 0,
  },
  {
    opacity: 1,
  },
]

export const fadeInUp = [
  {
    opacity: 0,
    transform: "translate3d(0, 40%, 0)",
  },
  {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
]

export const slideInRight = [
  {
    transform: "translate3d(-50%, 0, 0)",
  },
  {
    transform: "translate3d(0, 0, 0)",
    visibility: "visible",
  },
]

export const slideInLeft = [
  {
    transform: "translate3d(80%, 0, 0)",
    visibility: "visible",
  },
  {
    transform: "translate3d(0, 0, 0)",
  },
]

export const slideOutRight = [
  {
    transform: "translate3d(0, 0, 0)",
  },
  {
    visibility: "hidden",
    transform: "translate3d(100%, 0, 0)",
  },
]

export const slideInDown = [
  {
    transform: "translate3d(0, -50%, 0)",
  },
  {
    transform: "translate3d(0, 0, 0)",
    visibility: "visible",
  },
]

export const sideBarIn = () => {
  let animation = Object.assign(slideInLeft)
  animation[1].background = "black"
  return animation
}

export const sideBarChildren = () => {
  let animation = Object.assign(slideInRight)
  animation[1].color = "white"
  return animation
}
