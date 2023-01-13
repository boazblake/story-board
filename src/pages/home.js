import m from 'mithril'
import { Intro } from '@/components/intro'
import { Resume, resumeState } from '@/components/resume'
import { Portfolio, portfolioState } from '@/components/portfolio'
import { BottomSheet } from '@/components/bottom-sheet'


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
  view: () => m('.row',
    m(SheetBtn, { title: 'Resume', action: () => resumeState.hideSheet = false }),
    m(SheetBtn, { title: 'Portfolio', action: () => portfolioState.hideSheet = false })
  )
}

export const Home = {
  view: ({ attrs: { mdl } }) => m('#home', { style: { height: '100dvh' } },
    m(Intro, { mdl }),
    m(SheetBtns),
    m(BottomSheet, { state: resumeState }, m(Resume, { mdl })),
    m(BottomSheet, { state: portfolioState }, m(Portfolio, { mdl }))
  )
}
