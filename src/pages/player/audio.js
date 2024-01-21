import m from "mithril"
import { log } from '@/utils/index'
import { Wave } from "@/components/wave";
import {
    onWSTimeUpdate,
    onWSeeking,
    onWSInteraction,
    onWSZoom,
    initTimeLine,
    initRegions,
    onDecoded,
    onLoaded
} from './model.js'
import { clamp } from "ramda";

const onCreated = (WaveCreated) =>
    WaveCreated.then(initTimeLine)
        .then(initRegions)
        .then(onDecoded)
        .then(onLoaded)

export const Audio = ({ attrs: { mdl, playerState } }) => {

    const audioState = {
        status: 'loading',
        waveOptions: {
            minPxPerSec: 100,
            url: `data:audio/mp3;base64,${playerState.audio.track}`,
            events:
            {
                onWSTimeUpdate: onWSTimeUpdate({ mdl, playerState }),
                onWSeeking: onWSeeking({ mdl, playerState }),
                onWSInteraction: onWSInteraction({ mdl, playerState }),
                onWSPlay: log('onWSPlay'),
                onWSPause: log('onWSPause'),
                onWSFinish: log('onWSFinish'),
                onWSClick: log('onWSClick'),
                onWSDrag: log('onWSDrag'),
                onWSScroll: log('onWSscroll'),
                onWSZoom: onWSZoom({ mdl, playerState })
            }
        }
    }

    return {
        view: ({ attrs: { mdl, playerState, } }) =>
            m('', m(Wave, {
                mdl,
                playerState,
                audioState,
                waveOptions: audioState.waveOptions,
                onCreated,
            }),

                m('input', {
                    type: 'range', value: audioState.minPxPerSec, oninput: ({ target: { valueAsNumber } }) => {
                        const minPxPerSec = clamp(20, 1000, valueAsNumber)
                        audioState.waveOptions.events.onWSZoom({ audioState, minPxPerSec })
                    }
                })

            )
    }
}