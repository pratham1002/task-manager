const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('Calculate total with tip', () => {
    const total = calculateTip(10, 0.3)

    expect(total).toBe(13)
})

test('Total with default tip', () => {
    const total = calculateTip(10)

    expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const temperature = fahrenheitToCelsius(32)
    expect(temperature).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    const temperature = celsiusToFahrenheit(0)
    expect(temperature).toBe(32)
})

// test('Async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

// test('Add 2  numbers', (done) => {
//     add(2, 3).then((sum) => {
//         expect(sum).toBe(5)
//         done()
//     })
// })

test('Add 2 number async await', async () => {
    const sum = await add(10, 22)
    expect(sum).toBe(32)
})