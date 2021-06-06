import * as PIXI from 'pixi.js'

const pool = []
export default class BulletsFactory {
    create() {
        return pool.length ? this.pool.pop().draw() : new Bullet(25)
    }
}

class Bullet extends PIXI.Graphics {
    /**
     * @param {number} radius
     */
    constructor(radius) {
        super()
        this.radius = radius
        this.draw()
    }
    draw() {
        this.beginFill(Math.random() * 0xffffff).drawCircle(0, 0, this.radius)
        return this
    }
    destroy() {
        this.parent.removeChild(this)
        ;(this.pool ||= []).push(this.clear())
    }
}
