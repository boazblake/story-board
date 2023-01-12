import m from 'mithril'
import { Intro } from '@/components/intro'
import { Resume, resumeState } from '@/components/resume'
import { Portfolio, portfolioState } from '@/components/portfolio'
import { BottomSheet } from '@/components/bottom-sheet'


const SheetBtns = {
  view: () => m('.row',
    m("button", {
      onclick: e => resumeState.hideSheet = false,
      "type": "button",
      "id": "open-sheet",
      "aria-controls": "sheet"
    },
      "Resume"),
    m("button", {
      onclick: e => portfolioState.hideSheet = false,
      "type": "button",
      "id": "open-sheet",
      "aria-controls": "sheet"
    },
      "Portfolio")),
}

export const Home = {
  view: ({ attrs: { mdl } }) => m('#home',
    m(Intro, { mdl }),
    m(SheetBtns),
    m(BottomSheet, { state: resumeState }, m(Resume, { mdl })),
    m(BottomSheet, { state: portfolioState }, m(Portfolio, { mdl }))
  )
}
