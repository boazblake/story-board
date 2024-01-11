import m from 'mithril'


export const Modal = {
  oninit: ({
    attrs: { state, reset }
  }) => e => reset({ state, e }),
  view: ({ attrs: { mdl, state, onConfirm, onCancel, }, children }) =>
    m("ion-modal", { isOpen: state.showModal, },
      m("ion-header",
        m("ion-toolbar",
          m("ion-buttons", { slot: "start" },
            m("ion-button", {
              onclick: e => onCancel({ state, e })
            }, "Cancel")
          ),
          m("ion-title", "Add An Image or Video File"),
          m("ion-buttons", { slot: "end" },
            m("ion-button", { onclick: e => onConfirm({ mdl, state, e }), strong: "true" },
              "Save")))
      ),
      m("ion-content", { fullscreen: true, class: "ion-padding" },
        children
      )
    )
}