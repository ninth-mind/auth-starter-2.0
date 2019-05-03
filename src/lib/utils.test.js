// import * as utils from './utils'

// describe('Client Utils', () => {
//   it('validates inputs', () => {
//     let result = utils.sanitizeInputs({
//       email: 'jamie',
//       password: '#$%^&*(',
//       username: '12'
//     })
//     expect(result.valid).toBe(false)
//   })
// })

describe('outer', () => {
  describe('describe inner 1', () => {
    test('test 1', () => {
      expect(true).toEqual(true)
    })
  })

  test('test 1', () => {
    expect(true).toEqual(true)
  })

  describe('describe inner 2', () => {
    test('test for describe inner 2', () => {
      expect(false).toEqual(false)
    })
  })
})
