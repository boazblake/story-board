import m from 'mithril'
import { Animate } from "@/styles/index"
import { sideBarIn, slideOutRight } from "@/styles/animations"
import { Header, SideBar } from "@/components"

export const Layout = () => {
  return {
    view: ({ attrs: { mdl }, children }) =>
      m(
        "#app",
        m(Header, { mdl }),
        children,
        mdl.status.sidebar &&
        mdl.settings.profile !== "desktop" &&
        m(SideBar, {
          // oncreate: Animate(sideBarIn()),
          // onbeforeremove: Animate(slideOutRight),
          mdl,
        })
      ),
  }
}
