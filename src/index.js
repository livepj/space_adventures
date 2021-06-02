import * as PIXI from 'pixi.js'
import { Asteroid } from './Asteroid'
import { keyboardHandler } from './KeyboardHandler'
const width = 1280
const height = 720
const maxY = 300
const bulletRadius = 25
const bulletSpeed = 10
const shipSpeed = 3

const app = new PIXI.Application({ sharedTicker: true, sharedLoader: true, width, height })
document.body.appendChild(app.view)

PIXI.Loader.shared.add('background', 'assets/background.png')
PIXI.Loader.shared.add('asteroid', 'assets/asteroid.png')
PIXI.Loader.shared.add('spaceship', 'assets/spaceship.png')
PIXI.Loader.shared.load(init)
const asteroidContainer = new PIXI.Container()
const bulletsPool = []
const bulletsContainer = new PIXI.Container()

function init() {
    app.stage.addChild(PIXI.Sprite.from('background'))
    app.stage.addChild(asteroidContainer)
    app.stage.addChild(bulletsContainer)
    for (let i = 10; i--; ) {
        const asteroid = new Asteroid()
        asteroid.position.set(Math.random() * (width - asteroid.radius * 2) + asteroid.radius, Math.random() * maxY + asteroid.radius)
        asteroidContainer.addChild(asteroid)
    }

    const ship = PIXI.Sprite.from('spaceship')
    ship.anchor.set(0.5)
    ship.position.set(width / 2, height - ship.height / 2 - 30)
    app.stage.addChild(ship)
    keyboardHandler.onKeyDown('Space', () => {
        const bullet = bulletsPool.length ? bulletsPool.pop() : new PIXI.Graphics().beginFill(Math.random() * 0xffffff).drawCircle(0, 0, bulletRadius)
        bullet.position = ship.position
        bulletsContainer.addChild(bullet)
    })

    function removeBullet(bullet) {
        bulletsPool.push(bulletsContainer.removeChild(bullet))
    }

    PIXI.Ticker.shared.add(delta => {
        for (const bullet of bulletsContainer.children) {
            const newY = bullet.y - bulletSpeed * delta
            if (-newY > bulletRadius) {
                removeBullet(bullet)
                return
            }
            bullet.y = newY
            const target = asteroidContainer.children.find(asteroid => getDistanse(asteroid.position, bullet.position) < bulletRadius + asteroid.radius)
            if (target) {
                bulletsContainer.removeChild(target)
                target.destroy()
                removeBullet(bullet)
            }
        }
        const { ArrowLeft, ArrowRight } = keyboardHandler.keyDict
        if (!ArrowLeft !== !ArrowRight) {
            let newShipX = shipSpeed * delta
            if (ArrowLeft) {
                newShipX *= -1
            }
            newShipX += ship.x
            const shipHalf = ship.width / 2
            if (newShipX < shipHalf) {
                newShipX = shipHalf
            } else if (newShipX > width - shipHalf) {
                newShipX = width - shipHalf
            }
            ship.x = newShipX
        }
    })
}

function getDistanse(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}
