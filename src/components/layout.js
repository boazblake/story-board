import m from 'mithril'
import { Header } from "@/components"


export const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        "#app",
        { oncreate: onscroll },
        m('.w3-display-top.w3-block', m(Header, { mdl })),
        m('.w3-container', children),
      ),
  }
}
