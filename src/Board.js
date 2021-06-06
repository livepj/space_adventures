import * as PIXI from 'pixi.js'
import { config, ui } from '.'
import Asteroid from './Asteroid'
import BulletsFactory from './Bullet'
import { keyboardHandler } from './KeyboardHandler'
import Ship from './Ship'
import Vector from './Vector'

const maxY = 300
const bulletSpeed = 10

export default class Board extends PIXI.Container {
    constructor() {
        super()
        window.Vector = Vector
        this.addChild(PIXI.Sprite.from('background'))
        this._asteroidContainer = new PIXI.Container()
        this._bulletsContainer = new PIXI.Container()
        this.addChild(this._asteroidContainer)
        this.addChild(this._bulletsContainer)

        this.ship = new Ship()
        this.ship.position.set(config.width / 2, config.height - this.ship.height / 2 - 30)
        this.addChild(this.ship)

        const bulletsFactory = new BulletsFactory()
        keyboardHandler.onKeyDown('Space', () => {
            if (this._ammo <= 0 || this._stopped) {
                return
            }
            ui.ammo = --this._ammo
            const bullet = bulletsFactory.create()
            bullet.position = this.ship.position
            this._bulletsContainer.addChild(bullet)
        })
        PIXI.Ticker.shared.add(delta => {
            for (const bullet of this._bulletsContainer.children) {
                const newY = bullet.y - bulletSpeed * delta
                if (-newY > bullet.radius) {
                    bullet.destroy()
                    if (this._ammo + this._bulletsContainer.children.length < this._asteroidContainer.children.length) {
                        this._endGame(false)
                    }
                    return
                }
                bullet.y = newY
                const target = this._asteroidContainer.children.find(asteroid => this._checkCirclesCollision(bullet, asteroid))
                if (target) {
                    target.destroy()
                    if (!this._asteroidContainer.children.length) {
                        this._endGame(true)
                    } else {
                        bullet.destroy()
                    }
                }
            }
            this._checkCollisions()
        })
    }

    start() {
        const { ammo, enemies } = config
        this._ammo = ammo
        for (let i = 0; i < enemies; i++) {
            const asteroid = i < this._asteroidContainer.children.length ? this._asteroidContainer.getChildAt(i).randomize() : this._asteroidContainer.addChild(new Asteroid(maxY))
            this._setRandomAsteroidPosition(asteroid)
            while (this._asteroidContainer.children.some(otherAsteroid => otherAsteroid != asteroid && this._checkCirclesCollision(asteroid, otherAsteroid))) {
                this._setRandomAsteroidPosition(asteroid)
            }
        }
        this._stopped = false

        return new Promise(resolve => {
            this._resolve = resolve
        })
    }

    stop() {
        this._stopped = true
    }

    _checkCollisions() {
        const { length } = this._asteroidContainer.children
        this._asteroidContainer.children.forEach((asteroid, i, asteroids) => {
            for (let j = i + 1; j < length; j++) {
                const otherAsteroid = asteroids[j]
                if (this._checkCirclesCollision(asteroid, otherAsteroid)) {
                    const relativelyVector = otherAsteroid.vector
                    otherAsteroid.vector = new Vector()
                    asteroid.vector.substract(relativelyVector)
                    
                }
            }
        })
    }

    /**
     * @param {{x: number, y: string}} a
     * @param {{x: number, y: string}} b
     */
    _getDistanse(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
    }

    /**
     * @param {boolean} isWin
     */
    _endGame(isWin) {
        this._bulletsContainer.children.forEach(bullet => bullet.destroy())
        this._resolve(isWin)
    }

    /**
     * @param {{x: number, y: string, radius:number}} a
     * @param {{x: number, y: string, radius:number}} b
     */
    _checkCirclesCollision(a, b) {
        return (a.x - b.x) ** 2 + (a.y - b.y) ** 2 < (a.radius + b.radius) ** 2 //Квадрат дешевле в плане перфоманса, чем корень
    }

    /**
     * @param {Asteroid} asteroid
     */
    _setRandomAsteroidPosition(asteroid) {
        asteroid.position.set(Math.random() * (config.width - asteroid.radius * 2) + asteroid.radius, Math.random() * maxY + asteroid.radius)
    }
}
// СДЕЛАТЬ ВЫПУСК ПУЛЬ ВСЕХ ОДНОВРЕМЕННО ПОСЛЕ ВЫСТАВЛЕНИЯ ИХ НА ПОЛЕ. СДЕЛАТЬ УВЕЛИЧЕНИЕ КОЛИЧЕСТВА АСТЕРОИДОВ КАЖДЫЙ РАУНД И СБРАСЫВАТЬ ПРИ ПРОИГРЫШЕ
