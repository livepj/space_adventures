import * as PIXI from 'pixi.js'
import { config, ui } from '.'
import Asteroid from './Asteroid'
import { keyboardHandler } from './KeyboardHandler'
import Ship from './Ship'

const maxY = 300
const bulletRadius = 25
const bulletSpeed = 10

export default class Board extends PIXI.Container {
    constructor(callback) {
        super()
        this._callback = callback
        this.bulletsPool = []
        this.addChild(PIXI.Sprite.from('background'))
        this._asteroidContainer = new PIXI.Container()
        this._bulletsContainer = new PIXI.Container()
        this.addChild(this._asteroidContainer)
        this.addChild(this._bulletsContainer)

        this.ship = new Ship()
        this.ship.position.set(config.width / 2, config.height - this.ship.height / 2 - 30)
        this.addChild(this.ship)

        keyboardHandler.onKeyDown('Space', () => {
            if (this._ammo <= 0) {
                return
            }
            ui.ammo = --this._ammo
            const bullet = this.bulletsPool.length ? this.bulletsPool.pop() : new PIXI.Graphics()
            bullet.beginFill(Math.random() * 0xffffff).drawCircle(0, 0, bulletRadius)
            bullet.position = this.ship.position
            this._bulletsContainer.addChild(bullet)
        })
    }

    start() {
        const { ammo, width } = config
        this._ammo = ammo
        for (let i = 0; i < ammo; i++) {
            const asteroid = i < this._asteroidContainer.children.length ? this._asteroidContainer.getChildAt(i) : this._asteroidContainer.addChild(new Asteroid())
            asteroid.position.set(Math.random() * (width - asteroid.radius * 2) + asteroid.radius, Math.random() * maxY + asteroid.radius)
        }

        PIXI.Ticker.shared.add(delta => {
            if (this._stopped) return
            for (const bullet of this._bulletsContainer.children) {
                const y = bullet.y - bulletSpeed * delta
                if (-y > bulletRadius) {
                    this.removeBullet(bullet)
                    return
                }

                const target = this._asteroidContainer.children.find(asteroid => this.getDistanse(asteroid.position, { x: bullet.x, y }) < bulletRadius + asteroid.radius)
                if (target) {
                    target.destroy()
                    this.removeBullet(bullet)
                } else {
                    bullet.y = y
                }
            }
        })
        this._stopped = false
    }

    stop() {
        this._stopped = true
    }

    getDistanse(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
    }

    removeBullet(bullet) {
        this.bulletsPool.push(this._bulletsContainer.removeChild(bullet))
        if (this.ammo + this._bulletsContainer.children.length < this._asteroidContainer.children.length) {
            this._callback(false)
        } else if (!this._bulletsContainer.children.length && !this.ammo) {
            this._callback(!this._asteroidContainer.children.length)
        }
    }
}
// СДЕЛАТЬ ВЫПУСК ПУЛЬ ВСЕХ ОДНОВРЕМЕННО ПОСЛЕ ВЫСТАВЛЕНИЯ ИХ НА ПОЛЕ. СДЕЛАТЬ УВЕЛИЧЕНИЕ КОЛИЧЕСТВА АСТЕРОИДОВ КАЖДЫЙ РАУНД И СБРАСЫВАТЬ ПРИ ПРОИГРЫШЕ