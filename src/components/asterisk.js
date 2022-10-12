import m from 'mithril'
import { isSideBarActive } from "@/Utils"

export const Asterisk = {
  view: ({ attrs: { mdl } }) =>
    m(
      "button#asterisk.w3-left.w3-button.w3-circle",
      {
        class: isSideBarActive(mdl) ? "w3-black" : "w3-white",
        onclick: (e) => {
          mdl.status.sidebar = !mdl.status.sidebar
        },
      },
      m('.blob.red.pulse-red')
    ),
}
