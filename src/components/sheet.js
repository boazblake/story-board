import m from 'mithril'
import Stream from "mithril-stream"
import '../styles/sheet.css'

const setSheetHeight = (state) => {
  const height = Math.max(13, Math.min(100, state.sheetHeight()))
  return `${height}dvh`
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
    touchPosition(e).target.style.cursor = document.body.style.cursor = "grabbing"
    // if (!state.scrollTop()) return
    const y = touchPosition(e).pageY
    const deltaY = (state.scrollTop() - y)
    const deltaHeight = Math.round(deltaY / window.innerHeight * 100)
    console.log(deltaHeight, state.sheetHeight())
    const diff = deltaHeight > 0 ? 0.5 : -0.5
    state.sheetHeight((state.sheetHeight() + diff))
  }
}

const onDragEnd = (state) => (e) => {
  console.log('end', JSON.parse(JSON.stringify(state)))
  state.isDragging(false)
  state.selectable('not-selectable')

  touchPosition(e).target.style.cursor = document.body.style.cursor = ""

  // if (state.sheetHeight() < 15) {
  //   state.sheetHeight(13)
  //   state.hideSheet(false)
  // } else if (state.sheetHeight() > 75) {
  //   state.sheetHeight(100)
  //   state.hideSheet(false)
  // } else {
  //   state.hideSheet(false)
  // }
}

export const Sheet = () => {
  const state = {
    scrollTop: Stream(0),
    sheetHeight: Stream(13),
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
      },
        m(`.contents ${isFullScreen(state)}  ${state.selectable()}`,
          {
            style: { height: setSheetHeight(state) }
          },
          m("header.controls", {
            onmousedown: onDragStart(state),
            ontouchstart: onDragStart(state)
          },
            m(".draggable-area",
              m(".draggable-thumb")
            ),
          ),
          m("main.body",
            {
              oncreate: ({ dom }) => {
                setTimeout(() => {
                  state.hideSheet(false)
                  console.log(dom.scrollTop)
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


