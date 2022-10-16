import m from 'mithril'

const createAndAddScript = src => {
  window.paypal = null
  const script = document.createElement('script')
  script.src = src
  script.async = true
  script.type = 'text/javascript'
  const head = document.head
  head.insertBefore(script, head.firstChild)
  script.onload = (e) => Promise.resolve(script)

}

const createAndAddScripts = () => {
  if (Array.from(document.head.children).length == 12) {
    const _jspdf = createAndAddScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
    const _h2c = createAndAddScript("https://html2canvas.hertzen.com/dist/html2canvas.js")
    return Promise.all([_h2c, _jspdf])
  } else {
    return Promise.resolve()
  }
}

const printPDF = mdl => {

  setTimeout(() => {
    console.log(document.getElementById('resume'))
    var HTML_Width = 100
    var HTML_Height = 100
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + (top_left_margin * 2);
    var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    html2canvas(document.getElementById('resume')).then(function (canvas) {
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jspdf.jsPDF('p', 'px', [PDF_Width, PDF_Height]);
      console.log(PDF_Width, PDF_Height)
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }
      pdf.save('resume.pdf')
      document.getElementById('resume').hide();
    });
  }, 100)

}

const downloadPDF = mdl => {
  createAndAddScripts().then(
    printPDF(mdl)
  )

}

export const Header = {
  view: ({ attrs: { mdl } }) =>
    m(
      "header.w3-row",
      m('.w3-half',
        m(
          "h1",
          {
            class: 'w3-content w3-center',
            style: { maxWidth: '350px' },

          },
          m("code", "{ "),
          m("code.typewriter type-writer", {
            oncreate: ({ dom }) =>
            (dom.onanimationend = () =>
              setTimeout(() => dom.classList.remove("type-writer"))),
          }, "Boaz Blake"),
          m("code", " }")
        ),
      ),
      m('.w3-half.w3-center',
        m(
          'a.w3-button',
          {
            download: 'Boaz_Blake_Resume.pdf',
            href: 'files/resume.pdf',
            // onclick: () => downloadPDF(mdl)
          },
          'Download Resume'
        )
      ),
    )
}
