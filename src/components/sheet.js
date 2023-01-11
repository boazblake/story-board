import m from 'mithril'
import '../styles/sheet.css'

const setSheetHeight = (mdl) => {
  const height = Math.max(13, Math.min(100, mdl.state.sheetHeight()))
  return `${height}vh`
}

const isFullScreen = mdl =>
  mdl.state.sheetHeight() === 80 ? "fullscreen" : ""

const isSelectable = mdl => mdl.state.selectable ? '' : 'not-selectable'

const touchPosition = (event) =>
  event.touches ? event.touches[0] : event

const onDragStart = mdl => (e) => {
  mdl.state.dragPos = touchPosition(e).pageY
  mdl.state.isDragging = true
  mdl.state.selectable = (false)
  e.target.style.cursor = document.body.style.cursor = "grabbing"
}

const onDragMove = mdl => (e) => {
  if (mdl.state.isDragging) {
    if (mdl.state.dragPos === undefined) return
    const y = touchPosition(e).pageY
    const deltaY = mdl.state.dragPos - y
    const deltaHeight = (deltaY / window.innerHeight * 100)
    mdl.state.sheetHeight(mdl.state.sheetHeight() + deltaHeight)
    setSheetHeight(mdl)
    m.redraw()

  }
}

const onDragEnd = (mdl) => (e) => {
  mdl.state.isDragging = false
  mdl.state.selectable = (true)
  e.target.style.cursor = document.body.style.cursor = ""

  if (mdl.state.sheetHeight() < 25) {
    mdl.state.sheetHeight(13)
    mdl.state.hideSheet(true)
  } else if (mdl.state.sheetHeight() > 75) {
    mdl.state.sheetHeight(80)
    mdl.state.hideSheet(false)
    setSheetHeight(mdl)
  } else {
    mdl.state.sheetHeight(13)
    setSheetHeight(mdl)
  }
}

export const Sheet = ({ attrs: { mdl } }) => {
  window.addEventListener("mousemove", onDragMove(mdl))
  window.addEventListener("touchmove", onDragMove(mdl))

  window.addEventListener("mouseup", onDragEnd(mdl))
  window.addEventListener("touchend", onDragEnd(mdl))

  return {
    view: ({ attrs: { mdl }, children }) =>
      m(".sheet#sheet", { ariaHidden: mdl.state.hideSheet(), role: "dialog" },
        m(`.contents ${isFullScreen(mdl)}  }`,
          {
            style: { height: setSheetHeight(mdl) }
          },
          m("header.controls", m(".draggable-area", {
            onmousedown: onDragStart(mdl),
            ontouchstart: onDragStart(mdl)
          }, m(".draggable-thumb")),
          ),
          m("main.body", children)
        )
      )
  }
}


