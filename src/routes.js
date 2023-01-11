import m from 'mithril'
import { Layout } from "@/components"
import { AnimatePage, } from "@/styles/index.js"
import { slideInLeft, slideInRight } from "@/styles/animations.js"
import { Home } from "@/pages/home.js"

const routes = (mdl) => {
  return {
    "/": {
      onmatch: (_, b) => {
        mdl.slug = b
        window.scrollTo(0, 0)
      },
      render: () =>
        m(
          Layout,
          { mdl },
          m(Home, {
            oncreate: AnimatePage(slideInRight),
            onscroll: (e) => console.log(e),
            onbeforeremove: AnimatePage(slideInLeft),
            mdl,
          })
        ),
    },

  }
}

export default routes
