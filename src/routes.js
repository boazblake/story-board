import m from 'mithril'
import { Layout } from "@/components"
import { Home } from "@/pages/home.js"

const routes = (mdl) => {
  return {
    "/": {
      onmatch: (_, b) => {
        mdl.slug = b
        window.scrollTo(0, 0)
      },
      render: () => m(Layout, { mdl }, m(Home, { mdl, })),
    },
  }
}

export default routes
