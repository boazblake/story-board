import m from 'mithril'
import { Layout } from "@/components/Layout"
import { Home } from "@/pages/home.js"
import { Player } from "@/pages/player.js"

const routes = (mdl) => {
  return {
    "/": {
      onmatch: (_, b) => {
        mdl.slug = b
      },
      render: () => m(Layout, { mdl }, m(Home, { mdl, })),
    },
    "/play/:uuid": {
      onmatch: ({ uuid }, b) => {
        mdl.slug = b
        mdl.currentAudioUuid = uuid
      },
      render: () => m(Layout, { mdl }, m(Player, { mdl, })),
    },
  }
}

export default routes
