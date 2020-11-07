const {calculate, celsiusToFahrenheit, fahrenheitToCelsius } = require('../src/math')


test('Should calculate total with tip', ()=>{
    const total = calculate(10, .3)
    expect(total).toBe(13)
    // if(total !== 13) throw new Error('total tip should be 13.  Got', total)
})

test('Should calculate total with default tip', ()=>{
    const total = calculate(10)
    expect(total).toBe(12.5)
})

test(`Should convert 32 F to 0 C`, ()=>{
    const celsius = fahrenheitToCelsius(32);
    expect(celsius).toBe(0)
})

test(`Should convert 0 C to 32 F`, ()=>{
    const fahrenheit = celsiusToFahrenheit(0);
    expect(fahrenheit).toBe(32)
})

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!