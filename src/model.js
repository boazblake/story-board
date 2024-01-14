import Stream from "mithril-stream"


const model = {
  dom: null,
  currentAudioId: null,
  wavesurfer: {
    model: null, regions: null, timeline: null
  },
  state: {
    selectable: Stream(''),
    dragPos: 0,
    hideSheet: Stream(false),
    sheetHeight: Stream(13),
    isLoading: Stream(false),
    loadingProgress: { max: 0, value: 0 },
    isLoggedIn: () => sessionStorage.getItem("token"),
  },
  settings: { width: "", profile: "", inspector: "" },
}

export default model
