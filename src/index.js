import m from 'mithril'
import routes from './routes.js'
import model from './model.js'
import './styles/index.css'


const root = document.body
let winW = window.innerWidth

// set display profiles
const getProfile = (w) => {
    if (w < 600) return 'phone'
    if (w < 920) return 'tablet'
    return 'desktop'
}

const checkWidth = (winW) => {
    const w = window.innerWidth
    if (winW !== w) {
        winW = w
        var lastProfile = model.settings.profile
        model.settings.width = w
        model.settings.profile = getProfile(w)
        if (lastProfile != model.settings.profile) m.redraw()
    }
    return requestAnimationFrame(checkWidth)
}

model.settings.profile = getProfile(winW)

checkWidth(winW)
m.route(root, '/', routes(model))
