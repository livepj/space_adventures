import * as PIXI from 'pixi.js'
import { config } from '.'
import { keyboardHandler } from './KeyboardHandler'

const thisSpeed = 3

export default class Ship extends PIXI.Sprite {
    constructor() {
        super(PIXI.Texture.from('spaceship'))
        this.anchor.set(0.5)
        const { width } = config
        const thisHalf = this.width / 2
        PIXI.Ticker.shared.add(delta => {
            const { ArrowLeft, ArrowRight } = keyboardHandler.keyDict
            if (!ArrowLeft === !ArrowRight) {
                return
            }
            let newShipX = thisSpeed * delta
            if (ArrowLeft) {
                newShipX = -newShipX
            }
            newShipX += this.x
            if (newShipX < thisHalf) {
                newShipX = thisHalf
            } else if (newShipX > width - thisHalf) {
                newShipX = width - thisHalf
            }
            this.x = newShipX
        })
    }
}
