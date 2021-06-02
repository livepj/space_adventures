import * as PIXI from 'pixi.js'
import { KeyboardHandler } from './keyboard-handler'

const app = new PIXI.Application({ sharedTicker: true, sharedLoader: true, width: 1280, height: 720 })
document.body.appendChild(app.view)

PIXI.Loader.shared.add('background', 'assets/background.png')
PIXI.Loader.shared.add('asteroid', 'assets/asteroid.png')
PIXI.Loader.shared.add('spaceship', 'assets/spaceship.png')
PIXI.Loader.shared.load(init)

function init() {
    const keyboardHandler = new KeyboardHandler()
    app.stage.addChild(PIXI.Sprite.from('background'))
}
