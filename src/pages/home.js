import m from 'mithril'
import { AnimateChildren, fadeInUp, Animate, popIn } from "@/styles"
import { log, randomPause, Pause } from "@/Utils"
// import { Walkabout } from "components"

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
  { href: "/resume", src: "images/cv.webp" },
  { href: "/portfolio", src: "images/applications.svg" },
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
          onmouseenter: () => (state.hover = true),
          onmouseleave: () => (state.hover = false),
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

const calcSize = ({ settings: { profile } }) => {
  switch (profile) {
    case "phone":
      return { width: "200px", height: "200px" }
    case "tablet":
      return { width: "250px", height: "250px" }
    case "desktop":
      return { width: "300px", height: "300px" }
  }
}

export const Home = {
  view: ({ attrs: { mdl } }) =>
    m(
      ".w3-container",
      {
        style: { maxHeight: "80vh" },
        oncreate: AnimateChildren(fadeInUp, Pause(0.05)),
      },


      m(
        ".w3-row",
        m('.w3-half', m("img#me", {
          style: {
            ...calcSize(mdl),
            transition: " all 1s ease-out;",
          },
          src: "images/me.webp",
        })),
        m(
          "p.w3-half",
          {
            style: {
              color: "black",
              fontSize: "1.4rem",
            },
          },
          "Front-End developer with half a decade of industry experience building a variety of different applications using a multitude of different frameworks and languages."
        ),),

      m(
        "a",
        {
          href: "mailto:boazblake@protonMail.com",
          style: {
            color: "black",
            padding: "4px",
            margin: "4px",
            fontSize: "1rem",
          },
        },
        "BoazBlake @ protonMail dot com"
      ),
      m(
        ".column-end",
        links.map(({ href, src, target }) => m(Link, { href, src, target }))
      )
    ),
}
