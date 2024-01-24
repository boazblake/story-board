import m from 'mithril'
import Task from "data.task"


const getSessionToken = () =>
    sessionStorage.getItem("story-board-session-token")
        ? sessionStorage.getItem("story-board-session-token")
        : ""

const onProgress = (mdl) => (e) => {
    if (e.lengthComputable) {
        mdl.state.loadingProgress.max = e.total
        mdl.state.loadingProgress.value = e.loaded
        m.redraw()
    }
}

function onLoad() {
    return false
}

const onLoadStart = (mdl) => (e) => {
    mdl.state.isLoading(true)
    return false
}

const onLoadEnd = (mdl) => (e) => {
    mdl.state.isLoading(false)
    mdl.state.loadingProgress.max = 0
    mdl.state.loadingProgress.value = 0
    return false
}

const xhrProgress = (mdl) => ({
    config: (xhr) => {
        xhr.onprogress = onProgress(mdl)
        xhr.onload = onLoad
        xhr.onloadstart = onLoadStart(mdl)
        xhr.onloadend = onLoadEnd(mdl)
    },
})

export const parseHttpError = (mdl) => (rej) => (e) => {
    mdl.state.isLoading(false)
    return rej(structuredClone(e))
}

export const parseHttpSuccess = (mdl) => (res) => (data) => {
    mdl.state.isLoading(false)
    return res(data)
}

const HttpTask = (method) => (mdl) => (url) => (body) => {
    mdl.state.isLoading(true)
    return new Task((rej, res) =>
        m
            .request({
                headers: {
                    // 'user-role': mdl.user.role,
                    'session-token': getSessionToken()
                },
                method,
                url,
                body,
                withCredentials: false,
                ...xhrProgress(mdl),
            })
            .then(parseHttpSuccess(mdl)(res), parseHttpError(mdl)(rej))
    )
}

// const lookupLocationTask = (query) => {
//   return new Task((rej, res) =>
//     m
//       .request({
//         method: "GET",
//         url: `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
//       })
//       .then(res, rej)
//   )
// }

const getTask = (mdl) => (url) => HttpTask("GET")(mdl)(url)(null)

// const cachCall = (url) =>
//   url == "users/me"
//     ? { "Cache-Control": "private" }
//     : {
//       "If-Modified-Since": new Date(),
//       "Cache-Control": "public, max-age=604800",
//     }

const prod = "https://story-book-api.cyclic.app/api"
const dev = "http://localhost:2001/api"
const proxy = dev
//process.env.NODE_ENV ? dev :

const B4A = {
    getTask: (mdl) => (url) => HttpTask("GET")(mdl)(`${proxy}/${url}`)(null),
    postTask: (mdl) => (url) => (dto) => HttpTask("POST")(mdl)(`${proxy}/${url}`)(dto),
    putTask: (mdl) => (url) => (dto) => HttpTask("PUT")(mdl)(`${proxy}/${url}`)(dto),
    deleteTask: (mdl) => (url) => HttpTask("DELETE")(mdl)(`${proxy}/${url}`)(null),
}

const openCageTask = (mdl) => (query) =>
    HttpTask("POST")(mdl)(`${proxy}/geo/opencage`)({ query, bounds: mdl.Map.bounds })

const http = {
    openCageTask,
    B4A,
    HttpTask,
    getTask,
}


export default http