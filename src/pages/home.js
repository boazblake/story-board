import m from "mithril";
import { isEmpty } from 'ramda'
import mockData from '../mock/data.json'

const state = {
  recordings: mockData
}

const selectItem = uuid => e => m.route.set(`/play/${uuid}`)

export const Home = {
  view: ({ attrs: { mdl } }) =>
    m('ion-page',
      m('ion-header', m('ion-toolbar')),
      isEmpty(state.recordings)
        ? m('ion-card',
          m('ion-card-header',
            m('ion-card-title', 'Add an Audio File to begin.'),
            m('ion-input', { type: 'file' })
          )

        )
        :
        m("ion-list",
          state.recordings.map(item => m("ion-item",
            m("ion-thumbnail", { slot: "start" },
              m("img", { src: "your-image-url" })
            ),
            m("ion-label", item.name),
            m("ion-button", {
              slot: "end",
              fill: "clear",
              color: "primary",
            },
              m("ion-icon", { slot: "icon-only", name: "information-circle-outline" })
            ),
            m('ion-button', {
              slot: "end", fill: "clear",
              onclick: selectItem(item.uuid)
            },
              m("ion-icon", {

                name: "chevron-forward-outline"
              }))

          )
          )
        )
    ),
};
