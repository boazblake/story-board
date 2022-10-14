import m from 'mithril'
import { Header } from "@/components"


export const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        "#app.w3-display-container",
        { oncreate: onscroll },
        m('.w3-display-top.w3-block', m(Header, { mdl })),
        m('.w3-auto.w3-margin', children),
        m('.w3-display-bottommiddle', m('button.w3-margin-top.w3-btn.w3-border.w3-border-red.w3-circle.w3-white', {
          onclick: () => {
            mdl.dom.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            })
          }, style: { opacity: `clamp(0,${mdl.scrollPos / 1000},1)`, position: 'relative', bottom: '150px' }
        }, '^'))
      ),
  }
}
