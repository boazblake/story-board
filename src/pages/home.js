import m from 'mithril'
import { Intro } from '@/components/intro'
import { Resume } from '@/components/resume'
import { Sheet } from '@/components/sheet'



export const Home = {
  view: ({ attrs: { mdl } }) => m('#home',
    m(Intro, { mdl }),
    m(Sheet, { mdl }, m(Resume, { mdl }))
  )
}
