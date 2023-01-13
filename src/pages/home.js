import m from 'mithril'
import { Intro } from '@/components/intro'
import { Resume } from '@/components/resume'
import { Portfolio } from '@/components/portfolio'
import { BottomSheet, State } from '@/components/bottom-sheet'


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
  view: () => m('.row',
    m(SheetBtn, { title: 'Resume', action: () => resumeState.hideSheet = false }),
    m(SheetBtn, { title: 'Portfolio', action: () => portfolioState.hideSheet = false })
  )
}

export const Home = {
  view: ({ attrs: { mdl } }) => m('#home', { style: { height: '100dvh' } },
    m(Intro, { mdl }),
    m(SheetBtns),
    !resumeState.hideSheet && m(BottomSheet, { state: resumeState }, m(Resume, { mdl })),
    !portfolioState.hideSheet && m(BottomSheet, { state: portfolioState }, m(Portfolio, { mdl }))
  )
}
