import m from 'mithril'


export const Footer = {
  view: ({ attrs: { mdl } }) =>
    m(
      "ion-toolbar",
      m('ion-button', 'some button')
    )
}
