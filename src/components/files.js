import m from "mithril"

export const Files = {
  view: ({ attrs: { mdl, playerState } }) => m("ion-list",

    playerState.status == 'loading'
      ? m('label.row.items-center.column.items-center.justify-center.column.justify-center', m('ion-spinner', { style: { width: '100px', height: '100px' }, name: 'dots' }), 'Loading Files')
      : playerState.images.map(item => m("ion-item", { onclick: e => selectItem(item.uuid) },
        m("ion-thumbnail", { slot: "start" },
          m("img", { src: item.src })
        ),
        m("ion-label", item.name),
        m("ion-button", {
          slot: "end",
          fill: "clear",
          color: "primary",
          onclick: e => selectItem(item.uuid)
        },
          m("ion-icon", { slot: "icon-only", name: "information-circle-outline" })
        ),
        m("ion-icon", { slot: "end", name: "chevron-forward-outline" })

      )
      )
  )
}