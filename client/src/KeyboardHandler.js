class KeyboardHandler {
    constructor() {
        this.keyDict = {}
        this._callBacksDict = {}
        document.addEventListener('keydown', ({ code }) => {
            if (!this.keyDict[code]) {
                this._callBacksDict[code]?.forEach(callBack => callBack(code))
                this.keyDict[code] = true
            }
        })
        document.addEventListener('keyup', e => (this.keyDict[e.code] = false))
    }
    onKeyDown(code, callBack) {
        if (!this._callBacksDict[code]) {
            this._callBacksDict[code] = [callBack]
        } else {
            this._callBacksDict[code].push(callBack)
        }
    }
}
export const keyboardHandler = new KeyboardHandler()
