import m from 'mithril'
import Stream from "mithril-stream"
import '../styles/sheet.css'

const setSheetHeight = (state) => {
  const height = Math.max(100, Math.min(window.innerHeight - 200, state.sheetHeight()))
  state.dom.style.height = `${height}px`
}

const isFullScreen = state =>
  state.sheetHeight() >= 80 ? "fullscreen" : ""


const touchPosition = (event) =>
  event.touches ? event.touches[0] : event

const onDragStart = state => (e) => {
  state.scrollTop(touchPosition(e).pageY)
  state.isDragging(true)
  state.selectable()
  touchPosition(e).target.style.cursor = document.body.style.cursor = "grabber"
}

const onDragMove = state => (e) => {
  if (state.isDragging()) {
    e.stopPropagation()
    e.preventDefault()
    e.stopImmediatePropagation()
    touchPosition(e).target.style.scroll = 'auto'
    touchPosition(e).target.style.cursor = document.body.style.cursor = "grabbing"
    console.log('tp', touchPosition(e), window.innerHeight - touchPosition(e).clientY)
    state.sheetHeight(window.innerHeight - touchPosition(e).clientY)
    setSheetHeight(state)
  }
}

const onDragEnd = (state) => (e) => {
  console.log('end', JSON.parse(JSON.stringify(state)))
  document.body.style.scroll = 'auto'

  state.isDragging(false)
  state.selectable('not-selectable')
  touchPosition(e).target.style.cursor = document.body.style.cursor = ""
}

export const Sheet = () => {
  const state = {
    scrollTop: Stream(0),
    sheetHeight: Stream(Math.min(50, 720 / window.innerHeight * 100)),
    hideSheet: Stream(true),
    selectable: Stream(''),
    isDragging: Stream(false),
  }


  return {
    view: ({ children }) =>
      m(".sheet#sheet", {
        ariaHidden: state.hideSheet(), role: "dialog",
        onmousemove: onDragMove(state),
        ontouchmove: onDragMove(state),
        onmouseup: onDragEnd(state),
        ontouchend: onDragEnd(state),
        ontouchcancel: onDragEnd(state),
      },
        m(`.contents ${isFullScreen(state)}  ${state.selectable()}`,
          { oncreate: ({ dom }) => state.dom = dom, },
          m("header.controls", {
            onmousedown: onDragStart(state),
            ontouchstart: onDragStart(state)
          }, m(".draggable-area", m(".draggable-thumb")),),
          m("main.body",
            {
              oncreate: () => {
                setTimeout(() => {
                  state.hideSheet(false)
                  state.sheetHeight(Math.min(50, 720 / window.innerHeight * 100)
                  )
                  m.redraw()
                }, .5)
              },
              // onscroll: e => {
              //   console.log(
              //     state.sheetHeight(),
              //     touchPosition(e).target.scrollTop,
              //   )


              //   touchPosition(e).target.scrollTop = touchPosition(e).target.scrollTop < 10 ? touchPosition(e).target.scrollTop * 2 : touchPosition(e).target.scrollTop

              //   const delta = state.sheetHeight() > 300 ? state.sheetHeight() : touchPosition(e).target.scrollTop > 100 ? touchPosition(e).target.scrollTop / 6 : touchPosition(e).target.scrollTop / 4

              //   state.sheetHeight(delta)
              //   state.hideSheet(false)
              // },

            },
            m('', { class: state.isDragging() ? 'not-selectable' : '' }, children))
        )
      )
  }
}


