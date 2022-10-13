import m from 'mithril'
// import { nameFromRoute, randomPause, isSideBarActive } from "@/Utils.js"

export const Header = {
  view: ({ attrs: { mdl } }) =>
    m(
      "header.w3-row",
      m('.w3-half',
        m(
          "h1.typewriter type-writer",
          {
            class: 'w3-content',
            id: "logo-header",
            oncreate: ({ dom }) =>
            (dom.onanimationend = () =>
              setTimeout(() => dom.classList.remove("type-writer"))),
          },
          m("code", "{Boaz Blake}")
        ),
      ),
      m('.w3-half.w3-center',
        m(
          'a.w3-button',
          {
            download: 'Boaz_Blake_Resume.pdf',
            href: 'files/resume.pdf'
          },
          'Download Resume'
        )
      ),
    )
}
