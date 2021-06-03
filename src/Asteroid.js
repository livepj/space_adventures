import * as PIXI from 'pixi.js'

export default class Asteroid extends PIXI.Container {
    constructor(maxY) {
        super()
        this._sprite = PIXI.Sprite.from('asteroid')
        this._sprite.anchor.set(0.5)
        this.radius = this._sprite.width / 2
        this.addChild(this._sprite)
        this.addChild(new PIXI.Graphics().beginFill(0xffffff, 0.5).drawCircle(0, 0, this.radius)) //TODO remove this

        const rotationSpeed = (Math.random() - 0.5) / 10
        const speed = Math.random()
        let direction = Math.random() * Math.PI * 2
        this._update = delta => {
            this._sprite.rotation += rotationSpeed * delta
        }
        PIXI.Ticker.shared.add(this._update)
    }
    destroy() {
        PIXI.Ticker.shared.remove(this._update)
        super.destroy({ children: true })
    }
}
