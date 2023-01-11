import m from 'mithril'
import Stream from "mithril-stream"
import '../styles/sheet.css'

const setSheetHeight = (state) => {
  const height = Math.max(13, Math.min(100, state.sheetHeight()))
  return `${height}vh`
}

const isFullScreen = state =>
  state.sheetHeight() >= 80 ? "fullscreen" : ""


const touchPosition = (event) =>
  event.touches ? event.touches[0] : event

const onDragStart = state => (e) => {
  state.scrollTop(touchPosition(e).pageY)
  state.isDragging = true
  state.selectable()
  e.target.style.cursor = document.body.style.cursor = "grabbing"
}

const onDragMove = state => (e) => {
  if (state.isDragging) {
    console.log(state.sheetHeight(),
      e.target.scrollTop,)
    if (!state.scrollTop()) return
    const y = touchPosition(e).pageY
    const deltaY = state.scrollTop() - y
    const deltaHeight = (deltaY / window.innerHeight * 100)
    state.sheetHeight(state.sheetHeight() + deltaHeight)
    setSheetHeight(state)
  }
  m.redraw()
}

const onDragEnd = (state) => (e) => {
  state.isDragging = false
  state.selectable('not-selectable')
  e.target.style.cursor = document.body.style.cursor = ""


  if (state.sheetHeight() < 15) {
    state.sheetHeight(13)
    state.hideSheet(true)
    setSheetHeight(state)
  } else if (state.sheetHeight() > 75) {
    // state.sheetHeight(80)
    state.hideSheet(false)
    setSheetHeight(state)
  } else {
    state.sheetHeight(50)
    state.hideSheet(false)
    setSheetHeight(state)
  }
  m.redraw()
}

export const Sheet = () => {
  const state = {
    scrollTop: Stream(0),
    sheetHeight: Stream(13),
    hideSheet: Stream(true),
    selectable: Stream(''),
    isDragging: false,
  }
  window.addEventListener("mousemove", onDragMove(state))
  window.addEventListener("touchmove", onDragMove(state))

  window.addEventListener("mouseup", onDragEnd(state))
  window.addEventListener("touchend", onDragEnd(state))
  return {
    view: ({ children }) =>
      m(".sheet#sheet", { ariaHidden: state.hideSheet(), role: "dialog" },
        m(`.contents ${isFullScreen(state)}  ${state.selectable()}`,
          {
            style: { height: setSheetHeight(state) }
          },
          m("header.controls", m(".draggable-area", {
            onmousedown: onDragStart(state),
            ontouchstart: onDragStart(state)
          }, m(".draggable-thumb")),
          ),
          m("main.body",
            {
              oncreate: () => {
                setTimeout(() => {
                  state.hideSheet(false)
                  m.redraw()
                }, 1500)
              },
              onscroll: e => {
                console.log(
                  state.sheetHeight(),
                  e.target.scrollTop,
                )


                e.target.scrollTop = e.target.scrollTop < 10 ? e.target.scrollTop * 2 : e.target.scrollTop

                const delta = state.sheetHeight() > 300 ? state.sheetHeight() : e.target.scrollTop > 100 ? e.target.scrollTop / 6 : e.target.scrollTop / 4

                state.sheetHeight(delta)
                state.hideSheet(false)
                return false
              },

            },
            children)
        )
      )
  }
}


