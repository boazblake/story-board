import m from 'mithril'
import { Links } from '@/components/links'
import { Resume } from '@/components/resume'
import { Portfolio } from '@/components/portfolio'
import { BottomSheet, State } from '@/components/bottom-sheet'


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
  view: () => m('.w3-cell-row.w3-block.w3-center',
    m('.w3-cell', m(SheetBtn, { title: 'Resume', action: () => resumeState.hideSheet = false })),
    m('.w3-cell', m(SheetBtn, { title: 'Portfolio', action: () => portfolioState.hideSheet = false }))
  )
}

export const Home = {
  view: ({ attrs: { mdl } }) => m('#home.column.items-center.justify-between', { style: { height: '90dvh' } },
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
    m(SheetBtns),
    m(Links),
    m(
      "p.w3-container.w3-large.w3-margin",
      "Software engineer with half a decade of industry experience building a variety of different applications using a multitude of different frameworks and languages."
    ),
    m(BottomSheet, { state: resumeState }, m(Resume, { mdl })),
    m(BottomSheet, { state: portfolioState }, m(Portfolio, { mdl }))
  )
}
