import m from 'mithril'
import { Animate, popIn } from "@/styles"
import { randomPause } from "@/Utils"

const links = [
  {
    href: "https://github.com/boazblake",
    src: "images/github.svg",
    target: "_blank",
  },
  {
    href: "https://www.linkedin.com/in/boazblake/",
    src: "images/linkedin.svg",
    target: "_blank",
  },
]



const Link = () => {
  let state = {
    hover: false,
  }
  return {
    view: ({ attrs: { href, src, target } }) =>
      m(
        target ? "a" : m.route.Link,
        {
          class: 'w3-cell',
          // onmouseenter: () => (state.hover = true),
          // onmouseleave: () => (state.hover = false),
          oncreate: Animate(popIn, randomPause),
          target: target ? "_blank" : "",
          href,
        },
        m("img", {
          style: {
            margin: "2px",
            height: "50px",
            width: "50px",
            transition: "transform .1s ease-in",
            ...(state.hover && { transform: "skewY(10deg)" }),
          },
          src,
        })
      ),
  }
}

export const Links = {
  view: () => m(".w3-cell-row.w3-block.w3-center.w3-margin.w3-padding", links.map(({ href, src, target }) => m(Link, { href, src, target }))),
}
