import m from 'mithril'
import { Links } from './links'


const calcImgSize = ({ settings: { profile } }) => {
  switch (profile) {
    case "phone":
      return { width: "200px", height: "200px" }
    default:
      return { width: "250px", height: "250px" }
    // case "desktop":
    //   return { width: "300px", height: "300px" }
  }
}

export const Intro = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m('.',
        m("img#me.w3-block.w3-content", {
          style: {
            ...calcImgSize(mdl),
            transition: " all 1s ease-out;",
          },
          src: "images/me.webp",
        }),

        m(
          "a.w3-block.w3-center",

          m("p.w3-row",
            m('a.w3-col', { href: "https://boazblake.github.io/identity", target: '-blank' }, "https://BoazBlake.Github.Io/identity"),
            m('a.w3-col', { href: "mailto:boazblake@protonMail.com" }, "BoazBlake@ProtonMail.com"),
            m('a.w3-col', "347-420-3251")
          ),
          m("p",
            "Motivated - Self Driven - JS Developer"
          ),

        ),
        m(Links),
        m(
          "p.w3-container.w3-large",
          "Front-End developer with half a decade of industry experience building a variety of different applications using a multitude of different frameworks and languages."
        ),


      )

  }
}
