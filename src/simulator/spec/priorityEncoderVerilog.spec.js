// Imported first so the module graph is initialised in the same order as the
// simulator itself, as the other specs in this directory do.
import '../src/setup'
import PriorityEncoder from '../src/modules/PriorityEncoder'

describe('PriorityEncoder.moduleVerilog', () => {
    beforeEach(() => {
        PriorityEncoder.resetVerilog()
    })

    test('a 4 input encoder tests every input in descending priority', () => {
        PriorityEncoder.selSizes.add(2)
        const verilog = PriorityEncoder.moduleVerilog()

        expect(verilog).toContain('if (in3)')
        expect(verilog).toContain('else if (in2)')
        expect(verilog).toContain('else if (in1)')
        expect(verilog).toContain('else if (in0)')
    })

    test('every declared input of an 8 input encoder is read', () => {
        PriorityEncoder.selSizes.add(3)
        const verilog = PriorityEncoder.moduleVerilog()

        for (let i = 0; i < 8; i++) {
            expect(verilog).toContain('sel = ' + i + ';')
        }
    })
})
