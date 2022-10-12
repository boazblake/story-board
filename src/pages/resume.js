import m from 'mithril'

export const Resume = {
  view: () =>
    m(
      "embed.w3-container.overflow",
      {
        src: "files/resume.pdf",
        style: {
          height: '80vh',
          width: '100%',
        },
      },

    ),
}
