import * as PIXI from 'pixi.js'
import Board from './Board'
import UI from './UI'

const width = 1280
const height = 720

export const config = {
    width,
    height,
    ammo: 10,
    enemies: 5,
    time: 60
}

const app = new PIXI.Application({ sharedTicker: true, sharedLoader: true, width, height })
document.body.appendChild(app.view)

PIXI.Loader.shared.add('background', 'assets/background.png').add('asteroid', 'assets/asteroid.png').add('spaceship', 'assets/spaceship.png').load(start)

window.PIXI = PIXI

export const ui = new UI(async () => {
    await stop()
    start()
})

app.stage.addChild(ui.container)
let board

/**
 * @param {boolean} isWin
 */
async function stop(isWin) {
    board.stop()
    ui.stop()
    await ui.showBigText(isWin ? 'VICTORY' : 'GAME OVER')
    start()
}

function start() {
    if (!board) {
        board = new Board()
        window.board = board
        app.stage.addChildAt(board, 0)
    }
    Promise.any([board.start(), ui.start()]).then(stop)
}

/**
 * @param {number} time
 */
export function delay(time) {
    const ticker = PIXI.Ticker.shared
    return new Promise(resolve => {
        const delayFunc = () => {
            time -= ticker.deltaMS
            if (time <= 0) {
                ticker.remove(delayFunc)
                resolve()
            }
        }
        ticker.add(delayFunc)
    })
}
