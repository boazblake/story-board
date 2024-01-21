import m from 'mithril'


export const Modal = {
  oncreate: ({ attrs, dom }) => attrs.onCreated({ attrs, dom }),
  view: ({ attrs, children }) =>
    m("ion-modal", { isOpen: attrs.state.showModal, },
      m("ion-header",
        m("ion-toolbar",
          m("ion-buttons", { slot: "start" },
            m("ion-button", {
              onclick: e => attrs.onCancel(attrs, e)
            }, "Cancel")
          ),
          m("ion-title", "Add An Image or Video File"),
          m("ion-buttons", { slot: "end" },
            m("ion-button", { onclick: e => attrs.onConfirm(attrs, e), strong: "true" },
              "Save")))
      ),
      m("ion-content", { fullscreen: true, class: "ion-padding" },
        children
      )
    )

}