const {calculate } = require('../src/math')


test('Should calculate total with tip', ()=>{
    const total = calculate(10, .3)
    expect(total).toBe(13)
    // if(total !== 13) throw new Error('total tip should be 13.  Got', total)
})

test('Should calculate total with default tip', ()=>{
    const total = calculate(10)
    expect(total).toBe(12.5)
})