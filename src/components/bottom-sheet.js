import m from 'mithril'
import '../styles/bottom-sheet.css'

const getHeight = (state) => {
  const sheetHeight = Math.max(14, Math.min(100, state.sheetHeight))
  return `${sheetHeight}vh`
}

const isFullScreen = state => state.sheetHeight >= 80 ? 'fullscreen' : ''
const isSelectable = state => state.selectable ? '' : 'not-selectable'

const touchPosition = (event) => event.touches ? event.touches[0] : event

const getCursor = state => state.isDragging ? "grabbing" : 'grabber'

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

const resetState = state => {
  console.log(state)
  state = State()
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
  view: ({ attrs: { state }, children }) => m('', {
    onmousemove: onDragMove(state),
    ontouchmove: onDragMove(state),
    onmouseup: onDragEnd(state),
    ontouchend: onDragEnd(state)
  }, m("#sheet.sheet",
    { "aria-hidden": `${state.hideSheet}`, "role": "dialog", },
    m(".overlay"),
    m(`#contents.${isFullScreen(state)} ${isSelectable(state)}`,
      { style: { height: getHeight(state) } },
      m("header.controls",
        m(`.draggable-area.${getCursor(state)}`, { ontouchstart: onDragStart(state), onmousedown: onDragStart(state) },
          m(".draggable-thumb", {
            style: {
              height: state.isDragging && '1.2rem',
              width: state.isDragging && '4rem'
            }
          })),
        m("button.close-sheet",
          { onclick: () => { state.hideSheet = true; resetState(state) }, "type": "button", "title": "Close the sheet" },
          m.trust("&times;")
        )),
      m("main", { "class": "body", style: { height: '100%' } }, children)))),
  onremove: ({ attrs: { state } }) => resetState(state)
}


export { BottomSheet, State }
