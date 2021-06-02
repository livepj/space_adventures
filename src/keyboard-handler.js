export class KeyboardHandler {
    constructor() {
        this.dict = {}
        document.addEventListener('keydown', (e) => (this.dict[e.code] = true))
        document.addEventListener('keyup', (e) => (this.dict[e.code] = false))
    }
}
