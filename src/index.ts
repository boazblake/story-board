import m from "mithril";
import routes from "./routes.js"
import model from "./model.js"

const root = document.body
let winW = window.innerWidth

if (process.env.NODE_ENV == "development") {
  console.log("Looks like we are in development mode!")
} else {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((registration) => {
          console.log("⚙️ SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("🧟 SW registration failed: ", registrationError)
        })
    })
  }
}

// set display profiles
const getProfile = (w: number) => {
  if (w < 668) return "phone"
  if (w < 920) return "tablet"
  return "desktop"
}

const checkWidth = (winW: number) => {
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

m.route(root, "/home", routes(model))
