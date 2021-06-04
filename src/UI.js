import * as PIXI from 'pixi.js'
import { config, delay } from '.'

const style = { fontSize: 100, fill: 0xffffff }

export default class UI {
    constructor() {
        const { ammo, time, width, height } = config

        this._container = new PIXI.Container()

        this._ammoText = new PIXI.Text(ammo.toString(), style)
        this._ammoText.anchor.set(1)
        const textY = height - 200
        this._ammoText.position.set(width - 20, textY)
        this.container.addChild(this._ammoText)

        this._timerText = new PIXI.Text(time.toString(), style)
        this._timerText.position.set(20, textY)
        this._timerText.anchor.y = 1
        this.container.addChild(this._timerText)
        this._timer = () => {
            this._timerText.text = Math.ceil((this._time -= PIXI.Ticker.shared.deltaMS / 1000)).toString()
            if (this._time <= 0) {
                stop()
                this._resolve()
            }
        }
    }

    async showBigText(text) {
        const { width, height } = config
        const pixiText = new PIXI.Text(text, { fontSize: 200, fill: 0xffffff, fontWeight: 600 })
        pixiText.anchor.set(0.5)
        pixiText.position.set(width / 2, height / 2)
        this.container.addChild(pixiText)
        await delay(3000)
        pixiText.destroy()
    }

    get container() {
        return this._container
    }

    /**
     * @param {number} value
     */
    set ammo(value) {
        this._ammoText.text = value.toString()
    }
    start() {
        const { time, ammo } = config
        this.ammo = ammo
        this._timerText.text = time.toString()
        this._time = time
        PIXI.Ticker.shared.add(this._timer)
        return new Promise(resolve => {
            this._resolve = resolve
        })
    }
    stop() {
        PIXI.Ticker.shared.remove(this._timer)
    }
}
