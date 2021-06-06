export default class Vector {
    constructor(x = 0, y = 0) {
        this._x = x
        this._y = y
    }

    get length() {
        return (this._length ??= !this._x && !this._y ? 0 : Math.sqrt(this.x ** 2 + this.y ** 2))
    }
    /**
     * @param {number} value
     */
    set length(value) {
        const factor = value / this.length
        this.x *= factor
        this.y *= factor
        this._length = value
    }

    /**
     * @param {Vector | number} a
     */
    add(a) {
        if (typeof a === 'number') {
            this.x += a
            this.y += a
        } else {
            this.x += a.x
            this.y += a.y
        }
        return this
    }

    /**
     * @param {Vector | number} a
     */
    subtract(a) {
        if (typeof a === 'number') {
            this.x -= a
            this.y -= a
        } else {
            this.x -= a.x
            this.y -= a.y
        }
        return this
    }

    /**
     * @param {Vector | number} a
     */
    multiply(a) {
        if (typeof a === 'number') {
            this.x *= a
            this.y *= a
        } else {
            this.x *= a.x
            this.y *= a.y
        }
        return this
    }

    clone() {
        return new Vector(this.x, this.y)
    }

    get x() {
        return this._x
    }
    set x(value) {
        this._length = undefined
        this._x = value
    }

    get y() {
        return this._y
    }
    set y(value) {
        this._length = undefined
        this._y = value
    }

    get normal() {
        return new Vector(this.x / this.length, this.y / this.length)
    }

    /**
     * @param {number} direction
     * @param {number} length
     */
    static fromDirectionAndLength(direction, length) {
        const vector = new Vector(Math.cos(direction) * length, Math.sin(direction) * length)
        vector._length = length
        return vector
    }

    /**
     * @param {{x:number, y:number}} output
     */
    static fromPoint(output) {
        return new Vector(output.x, output.y)
    }
}
