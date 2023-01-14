import m from 'mithril'
const perpendicular = [350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190]

const calcState = ({ settings: { profile } }) => {
  switch (profile) {
    case "phone":
      return {
        cx: 100,
        cy: 100,
        r: 100,
      }
    default:
      return {
        cx: 125,
        cy: 125,
        r: 125,
      }
  }
}

export const SineWaveBorderSVG = {
  view: ({ attrs: { mdl } }) => m('svg', { width: 0, height: 0, },
    m('defs',
      m('clipPath', {
        id: 'sine-wave',
      },
        m('path',
          {
            oncreate: ({ dom }) => {
              function updatePath() {
                const state = calcState(mdl)
                let d = "M";
                for (let i = 0; i <= 360; i++) {
                  let angle = i * Math.PI / 180;
                  let amplitude = Math.random() * 10;
                  let frequency = Math.max(0, Math.max(60, Math.random() * 4));
                  let x = state.cx + (state.r * Math.cos(angle));
                  let y = state.cy + (amplitude * Math.sin(frequency * angle)) + state.r * Math.sin(angle);
                  if (perpendicular.includes(i)) {
                    amplitude = Math.min(Math.random() * 10, amplitude)
                    x = state.cx + (amplitude * Math.sin(frequency * angle)) + state.r * Math.cos(angle);
                    y = state.cy + (state.r * Math.sin(angle));
                  }
                  d += " " + x + "," + y;
                }
                d += " Z";
                dom.setAttributeNS(null, "d", d);
                // updatePath()
              }

              // Animate the sine wave
              // updatePath();
              setInterval(function () {
                // phase += 1;
                // frequency += 1;
                requestAnimationFrame(updatePath)
                // updatePath();
              }, 300);
            },
          },
        ))))
}
