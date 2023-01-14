import m from 'mithril'
import '../styles/bottom-sheet.css'

const getHeight = (state) => {
  const sheetHeight = Math.max(14, Math.min(100, state.sheetHeight))
  return `${sheetHeight}vh`
}

const getProfile = (w) => {
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

const isFullScreen = state => {
  const profile = getProfile(window.innerWidth)
  switch (profile) {
    case 'phone': return state.sheetHeight >= 80 ? 'fullscreen' : ''
    case 'tablet': return state.sheetHeight >= 90 ? 'fullscreen' : ''
    case 'desktop': return state.sheetHeight >= 90 ? 'fullscreen' : ''
  }
}

const isSelectable = state => state.selectable ? '' : 'not-selectable'

const touchPosition = (event) => event.touches ? event.touches[0] : event

const getCursor = state => state.isDragging ? 'grabbing' : 'grabber'

const onDragStart = state => (event) => {
  state.dragPosition = touchPosition(event).pageY
  state.selectable = false
  state.isDragging = true
}

const onDragMove = state => (e) => {

  if (state.dragPosition === undefined) return
  const y = touchPosition(e).pageY
  const deltaY = state.dragPosition - y
  const deltaHeight = deltaY / window.innerHeight * 100
  state.sheetHeight = state.sheetHeight + deltaHeight
  state.dragPosition = y
  e.preventDefault()
}

const onDragEnd = state => () => {
  state.dragPosition = undefined
  state.selectable = false
  state.isDragging = false
}

const resetState = (state) => {
  console.log(state)
  state.sheetHeight = Math.min(50, 720 / window.innerHeight * 100)
  console.log(state)
}

const State = () => ({
  hideSheet: true,
  sheetHeight: Math.min(50, 720 / window.innerHeight * 100),
  dragPosition: undefined,
  isDragging: false,
  selectable: true,
})


const BottomSheet = {

  view: ({ attrs: { state }, children }) =>
    m('#sheet.sheet',
      {
        onmousemove: onDragMove(state),
        ontouchmove: onDragMove(state),
        onmouseup: onDragEnd(state),
        ontouchend: onDragEnd(state),
        onmouseleave: onDragEnd(state),
        ariaHidden: `${state.hideSheet}`,
        role: 'dialog',
      },
      m('.overlay'),
      m(`#contents.${isFullScreen(state)} ${isSelectable(state)}`,
        { style: { height: getHeight(state) } },
        m(`header.controls.${getCursor(state)}`, { ontouchstart: onDragStart(state), onmousedown: onDragStart(state) },
          m('.draggable-area',
            m('.draggable-thumb',)),
          m('button.close-sheet',
            {
              style: {
                height: '50px',
                width: '50px',
              }, onclick: () => { state.hideSheet = true; resetState(state) }, 'type': 'button', 'title': 'Close the sheet'
            },
            m.trust('&times;')
          )),
        m('main', { 'class': 'body', style: { height: '100 % ' } }, children))),
}


export { BottomSheet, State }
