const model = {
  dom: null,
  scrollPos: 0,
  state: {
    isLoading: false,
    loadingProgress: { max: 0, value: 0 },
    isLoggedIn: () => sessionStorage.getItem("token"),
  },
  settings: { width: "", profile: "", inspector: "" },
}

export default model
