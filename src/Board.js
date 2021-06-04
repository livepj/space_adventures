import * as PIXI from 'pixi.js'
import { config, ui } from '.'
import Asteroid from './Asteroid'
import { keyboardHandler } from './KeyboardHandler'
import Ship from './Ship'

const maxY = 300
const bulletRadius = 25
const bulletSpeed = 10

export default class Board extends PIXI.Container {
    constructor() {
        super()
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
            if (this._ammo <= 0 || this._stopped) {
                return
            }
            ui.ammo = --this._ammo
            const bullet = this.bulletsPool.length ? this.bulletsPool.pop() : new PIXI.Graphics()
            bullet.beginFill(Math.random() * 0xffffff).drawCircle(0, 0, bulletRadius)
            bullet.position = this.ship.position
            this._bulletsContainer.addChild(bullet)
        })
        PIXI.Ticker.shared.add(() => {
            this._checkCollision()
        })
    }

    start() {
        const { ammo, width, enemies } = config
        this._ammo = ammo
        for (let i = 0; i < enemies; i++) {
            const asteroid = i < this._asteroidContainer.children.length ? this._asteroidContainer.getChildAt(i).randomize() : this._asteroidContainer.addChild(new Asteroid(maxY))
            asteroid.position.set(Math.random() * (width - asteroid.radius * 2) + asteroid.radius, Math.random() * maxY + asteroid.radius)
        }

        PIXI.Ticker.shared.add(delta => {
            if (this._stopped) return
            for (const bullet of this._bulletsContainer.children) {
                const y = bullet.y - bulletSpeed * delta
                if (-y > bulletRadius) {
                    this._removeBullets(bullet)
                    if (this._ammo + this._bulletsContainer.children.length < this._asteroidContainer.children.length) {
                        this._endGame(false)
                    }
                    return
                }

                const target = this._asteroidContainer.children.find(asteroid => this._getDistanse(asteroid.position, { x: bullet.x, y }) < bulletRadius + asteroid.radius)
                if (target) {
                    target.destroy()
                    if (!this._asteroidContainer.children.length) {
                        this._endGame(true)
                    } else {
                        this._removeBullets(bullet)
                    }
                } else {
                    bullet.y = y
                }
            }
        })
        this._stopped = false

        return new Promise(resolve => {
            this._resolve = resolve
        })
    }

    stop() {
        this._stopped = true
    }

    _checkCollision() {
        const { length } = this._asteroidContainer.children
        this._asteroidContainer.children.forEach((asteroid, i, asteroids) => {
            for (let j = i + 1; j < length; j++) {
                const otherAsteroid = asteroids[j]
                const distance = this._getDistanse(asteroid, otherAsteroid)
                if (distance < asteroid.radius + otherAsteroid.radius) {
                    //Я думаю, можно легко добавить разные радиусы и считать при помощи них массу, например.
                    const forceVertor = new PIXI.Point((asteroid.x - otherAsteroid.x) / distance, (asteroid.y - otherAsteroid.y) / distance)
                    ;[asteroid.vector.x, asteroid.vector.y, otherAsteroid.vector.x, otherAsteroid.vector.y] = [otherAsteroid.vector.x, otherAsteroid.vector.y, asteroid.vector.y, asteroid.vector.x]
                }
            }
        })
    }

    _getDistanse(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
    }

    _removeBullets(...bullets) {
        if (!bullets.length) {
            bullets = this._bulletsContainer.children
        }
        for (const bullet of bullets) {
            this.bulletsPool.push(this._bulletsContainer.removeChild(bullet))
        }
    }
    _endGame(isWin) {
        this._removeBullets()
        this._resolve(isWin)
    }
}
// СДЕЛАТЬ ВЫПУСК ПУЛЬ ВСЕХ ОДНОВРЕМЕННО ПОСЛЕ ВЫСТАВЛЕНИЯ ИХ НА ПОЛЕ. СДЕЛАТЬ УВЕЛИЧЕНИЕ КОЛИЧЕСТВА АСТЕРОИДОВ КАЖДЫЙ РАУНД И СБРАСЫВАТЬ ПРИ ПРОИГРЫШЕ
