import { greet } from '../src/index'

describe('The greet way', () => {
  it('should greet with world', () => {
    expect(greet()).toBe('Hello, World')
  })

  it('should greet with someone', () => {
    expect(greet('Joi')).toBe('Hello, Joi')
  })
})