import * as PIXI from 'pixi.js'
import { config } from '.'

const maxSpeed = 2
const gravitation = 0.1

export default class Asteroid extends PIXI.Container {
    constructor(maxY) {
        super()
        this._sprite = PIXI.Sprite.from('asteroid')
        this._sprite.anchor.set(0.5)
        this.radius = this._sprite.width / 2
        this.addChild(this._sprite)

        const rotationSpeed = (Math.random() - 0.5) / 10
        this.randomize()
        this._update = delta => {
            this._sprite.rotation += rotationSpeed * delta

            if (this.x < this.radius) {
                this.vector.x += gravitation * delta
            } else if (this.x > config.width - this.radius) {
                this.vector.x -= gravitation * delta
            }

            if (this.y < this.radius) {
                this.vector.y += gravitation * delta
            } else if (this.y > maxY - this.radius) {
                this.vector.y -= gravitation * delta
            }
            this.x += this.vector.x * delta
            this.y += this.vector.y * delta
        }
        PIXI.Ticker.shared.add(this._update)
    }
    destroy() {
        PIXI.Ticker.shared.remove(this._update)
        super.destroy({ children: true })
    }
    randomize() {
        this.vector = new PIXI.Point(getRandomSpeed(), getRandomSpeed())
        function getRandomSpeed() {
            return Math.random() * maxSpeed * 2 - maxSpeed
        }
        return this
    }
}
