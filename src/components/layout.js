import m from 'mithril'


export const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m("ion-app",
        m('ion-content', { fullscreen: true }, children)
      )
  }
}
