import { simulationArea } from '../src/simulationArea'

vi.mock('codemirror', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        fromTextArea: vi.fn(() => ({ setValue: () => {} })),
    }
})

vi.mock('codemirror-editor-vue3', () => ({
    defineSimpleMode: vi.fn(),
}))

const ZoomIn = vi.fn()
const ZoomOut = vi.fn()

vi.mock('../src/listeners', () => ({
    ZoomIn: (...args) => ZoomIn(...args),
    ZoomOut: (...args) => ZoomOut(...args),
    pinchZoom: vi.fn(),
    getCoordinate: vi.fn(() => ({ x: 0, y: 0 })),
}))

// scheduleUpdate() needs a fully built globalScope, which is not what is
// under test here.
vi.mock('../src/engine', async (importOriginal) => ({
    ...(await importOriginal()),
    scheduleUpdate: vi.fn(),
    update: vi.fn(),
}))

const { default: startListeners } = await import('../src/embedListeners')

describe('embed listeners: keyboard zoom', () => {
    beforeAll(() => {
        document.body.innerHTML = `
            <div id="simulationArea"></div>
            <div id="elementName"></div>
        `
        startListeners()
    })

    beforeEach(() => {
        ZoomIn.mockClear()
        ZoomOut.mockClear()
        simulationArea.controlDown = true
    })

    // Firefox reports 171 for '+' and 173 for '-' instead of 187 / 189.
    test('Ctrl + "+" zooms in on browsers that report keyCode 171', () => {
        window.dispatchEvent(
            new KeyboardEvent('keydown', { keyCode: 171, key: '+' })
        )
        expect(ZoomIn).toHaveBeenCalled()
    })

    test('Ctrl + "-" zooms out on browsers that report keyCode 173', () => {
        window.dispatchEvent(
            new KeyboardEvent('keydown', { keyCode: 173, key: '-' })
        )
        expect(ZoomOut).toHaveBeenCalled()
    })

    test('Ctrl + "=" zooms in on browsers that report keyCode 187', () => {
        window.dispatchEvent(
            new KeyboardEvent('keydown', { keyCode: 187, key: '=' })
        )
        expect(ZoomIn).toHaveBeenCalled()
    })

    test('Ctrl + "-" zooms out on browsers that report keyCode 189', () => {
        window.dispatchEvent(
            new KeyboardEvent('keydown', { keyCode: 189, key: '-' })
        )
        expect(ZoomOut).toHaveBeenCalled()
    })
})
