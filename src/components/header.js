import m from 'mithril'
import { AnimateChildren } from "@/styles/index"
import { slideInDown } from "@/styles/animations"
import { Asterisk } from "./asterisk"
import { nameFromRoute, randomPause, isSideBarActive } from "@/Utils.js"

export const Header = {
  view: ({ attrs: { mdl } }) =>
    m(
      "header.w3-bar",
      {
        style: {
          transitionDuration: 2000,
          backgroundColor: isSideBarActive(mdl) ? "black" : "white",
        },
      },
      m(
        m.route.Link,
        {
          href: "/home",
          id: "logo-header",
          class: 'w3-left',
        },
        m(
          "h1.typewriter type-writer",
          {
            style: {
              color: isSideBarActive(mdl) ? "white" : "black",
            },
            oncreate: ({ dom }) =>
            (dom.onanimationend = () =>
              setTimeout(() => dom.classList.remove("type-writer"))),
          },
          m("code", "{Boaz Blake}")
        )
      ),
      mdl.settings.profile === "desktop"
        ? m(
          "nav.w3-right",
          {
            oncreate: AnimateChildren(slideInDown, randomPause),
          },
          mdl.routes
            .filter((r) => r !== m.route.get())
            .map((route) =>
              m(
                m.route.Link,
                {
                  class: "w3-bar-item",
                  href: route,
                },
                nameFromRoute(route)
              )
            )
        )
        : m(Asterisk, { mdl }),
    ),
}
