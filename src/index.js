import * as PIXI from 'pixi.js'
import Board from './board'
import UI from './UI'

const width = 1280
const height = 720

export const config = {
    width,
    height,
    ammo: 10,
    enemies: 10,
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
window.UI = ui
app.stage.addChild(ui.container)
let board

async function stop(isWin) {
    board.stop()
    ui.stop()
    await ui.showBigText(isWin ? 'VICTORY' : 'GAME OVER')
    start()
}

function start() {
    if (!board) {
        board = new Board(stop)
        window.board = board
        app.stage.addChildAt(board, 0)
    }
    board.start()
    ui.start()
}

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
