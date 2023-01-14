import m from 'mithril'
import { Links } from '@/components/links'
import { Resume } from '@/components/resume'
import { Portfolio } from '@/components/portfolio'
import { BottomSheet, State } from '@/components/bottom-sheet'
import { SineWaveBorderSVG } from '@/components/sine-wave'

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

const portfolioState = State()
const resumeState = State()

const SheetBtn = {
  view: ({ attrs: { action, title } }) => m("button", {
    onclick: action,
    "type": "button",
    "id": "open-sheet",
    "aria-controls": "sheet"
  },
    title)
}

const SheetBtns = {
  view: () => m('.w3-cell-row.w3-block.w3-center.w3-margin.w3-padding',
    m('.w3-cell', m(SheetBtn, { title: 'Resume', action: () => resumeState.hideSheet = false })),
    m('.w3-cell', m(SheetBtn, { title: 'Portfolio', action: () => portfolioState.hideSheet = false }))
  )
}

const getClassList = mdl => {
  switch (mdl.settings.profile) {
    case 'phone': return 'column.items-center.justify-evenly'
    case 'tablet': return 'row'
    case 'desktop': return 'column.items-center.justify-evenly'
  }
}

export const Home = {
  view: ({ attrs: { mdl } }) =>
    m(`#home.${getClassList(mdl)}.w3-container`, { style: { height: '90dvh' } },

      m('section.justify-evenly.w3-half.overflow',
        m('',
          m(SineWaveBorderSVG, { mdl }),

          m("img#me.w3-block.w3-content.svg-border", {
            style: {
              ...calcImgSize(mdl),
              transition: " all 1s ease-out;",
            },
            src: "images/me.webp",
          }),),

        m(
          "a.w3-block.w3-center",

          m("p.w3-row.overflow",
            m('a.w3-col', { href: "https://boazblake.github.io/identity", target: '-blank' }, "https://BoazBlake.Github.Io/identity"),
            m('a.w3-col', { href: "mailto:boazblake@protonMail.com" }, "BoazBlake@ProtonMail.com"),
            m('a.w3-col', "347-420-3251")
          ),
          m("p",
            "Motivated - Self Driven - JS Developer"
          ),

        ),
      ),
      m('section.justify-evenly.w3-half.w3-container.overflow',
        m(
          "p.w3-large.w3-margin.w3-center",
          "Software engineer with half a decade of industry experience building a variety of different applications using a multitude of different frameworks and languages."
        ),
        m(SheetBtns),
        m(Links),

        m(BottomSheet, { state: resumeState }, m(Resume, { mdl })),
        m(BottomSheet, { state: portfolioState }, m(Portfolio, { mdl }))
      ),
    )
}
