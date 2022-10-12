import m from 'mithril'
import { AnimateChildren } from "@/styles/index"
import { sideBarChildren, slideInLeft } from "@/styles/animations"
import { nameFromRoute, randomPause } from "@/Utils"

export const SideBar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ul.sidebar.w3-black",
        {
          oncreate: AnimateChildren(sideBarChildren(), randomPause),
          onbeforeremove: AnimateChildren(slideInLeft),
        },
        mdl.routes
          .filter((r) => r !== m.route.get())
          .map((route) =>
            m(
              m.route.Link,
              {
                class: "sidebar-item",
                href: route,
                selector: "li",
              },
              nameFromRoute(route)
            )
          )
      ),
  }
}
