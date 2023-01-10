import m from 'mithril'
import { Intro } from '@/components/intro'
import { Resume } from '@/components/resume'

const isPhone = (mdl) => {
  console.log(window.innerHeight)
  return mdl.settings.profile == 'phone'
}

const calcHeight = (mdl) => {
  return mdl.hide ? '0vh'
    :
    window.innerWidth <= 400 &&
      // window.innerHeight < 400
      // ? "80vh"
      mdl.scrollPos
      ? `${window.innerHeight - mdl.scrollPos}px`
      : '90vh'
}


export const Home = {
  view: ({ attrs: { mdl } }) =>
    m(
      `.w3-cell-row.${isPhone(mdl) ? 'overflow' : ''} `,
      {
        style: { height: '80vh' },
        onscroll: e => mdl.scrollPos = e.target.scrollTop,
      },
      m(`.w3-cell.w3-half.overflow.w3-display-container.w3-white.w3-mobile.sticky
      `, {
        style: {
          // '-webkit-transition': 'height 1s',
          // '-moz-transition': 'height 1s',
          // '-ms-transition': 'height 1s',
          // '-o-transition': 'height 1s',
          // 'transition': 'height 1s',
          // 'background': '#e5feff',
          // 'overflow': 'hidden',
          height: calcHeight(mdl),
        }
      }, m(Intro, { mdl }),
        // m('.w3-small', m('button', { onclick: () => { mdl.hide = true } }, 'more'))
      ),
      m('.w3-cell.w3-half.overflow.w3-display-container.w3-white', {
        style: { height: '80vh' },
        onscroll: e => mdl.scrollPos = e.target.scrollTop,
      }, m(Resume, { mdl })))
}
