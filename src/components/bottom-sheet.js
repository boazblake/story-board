import m from 'mithril'
import '../styles/bottom-sheet.css'

const getHeight = (state) => {
  const sheetHeight = Math.max(14, Math.min(100, state.sheetHeight))
  return `${sheetHeight}dvh`
}

const getProfile = (w) => {
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

const isFullScreen = state => {
  const profile = getProfile(window.innerWidth)
  switch (profile) {
    case 'phone': return state.sheetHeight >= 80 ? 'fullscreen' : 'not-fullscreen'
    case 'tablet': return state.sheetHeight >= 90 ? 'fullscreen' : 'not-fullscreen'
    case 'desktop': return state.sheetHeight >= 90 ? 'fullscreen' : 'not-fullscreen'
  }
}

const isSelectable = state => state.selectable ? 'selectable' : 'not-selectable'

const touchPosition = (event) => event.touches ? event.touches[0] : event

const getCursor = state => state.isDragging ? 'grabbing' : 'grabber'

const onDragStart = state => (e) => {
  e.preventDefault()
  state.dragPosition = touchPosition(e).pageY
  state.selectable = false
  state.isDragging = true
}

const onDragMove = state => (e) => {
  e.preventDefault()

  if (state.dragPosition === undefined) return
  const y = touchPosition(e).pageY
  const deltaY = state.dragPosition - y
  const deltaHeight = deltaY / window.innerHeight * 100
  state.sheetHeight = state.sheetHeight + deltaHeight
  state.dragPosition = y
}

const onDragEnd = state => (e) => {
  e.preventDefault()
  state.dragPosition = undefined
  state.selectable = true
  state.isDragging = false
}

const resetState = (state) =>
  state.sheetHeight = Math.min(50, 720 / window.innerHeight * 100)

const State = () => ({
  hideSheet: true,
  sheetHeight: Math.min(50, 720 / window.innerHeight * 100),
  dragPosition: undefined,
  isDragging: false,
  selectable: true,
})


const BottomSheet = {

  view: ({ attrs: { state, render } }) =>
    m('#bottomsheet.sheet',
      {
        onmousemove: onDragMove(state),
        ontouchmove: onDragMove(state),
        onmouseup: onDragEnd(state),
        ontouchend: onDragEnd(state),
        onmouseleave: onDragEnd(state),
        ariaHidden: `${state.hideSheet}`,
        // role: 'dialog',
        style: { bottom: isFullScreen(state) ? 0 : '3dvh' },
      },
      m('.overlay'),
      m(`#contents.${isFullScreen(state)} ${isSelectable(state)}`,
        { style: { height: getHeight(state), overflow: 'scroll' } },
        m(`header.controls.${getCursor(state)}`, { ontouchstart: onDragStart(state), onmousedown: onDragStart(state) },
          m('.draggable-area',
            m('.draggable-thumb',)),
          m('a.close-sheet', {
            ontouchstart: () => { state.hideSheet = true; resetState(state); console.log('close', state) },
            onclick: () => { state.hideSheet = true; resetState(state); console.log('close', state) }, 'type': 'button', 'title': 'Close the sheet'
          },
            m.trust('&times;')
          )),
        m('#sheet-contents.body', render(state)))),
}


export { BottomSheet, State }
