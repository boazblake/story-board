import Stream from "mithril-stream"

const model = {
  dom: null,
  state: {
    selectable: Stream(''),
    dragPos: 0,
    hideSheet: Stream(false),
    sheetHeight: Stream(13),
    isLoading: false,
    loadingProgress: { max: 0, value: 0 },
    isLoggedIn: () => sessionStorage.getItem("token"),
  },
  settings: { width: "", profile: "", inspector: "" },
}

export default model
