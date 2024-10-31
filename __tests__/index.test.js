/**
 * Unit tests for the action's entrypoint, src/index.js
 */

const { setup } = require('../src/main')

// Mock the action's entrypoint
jest.mock('../src/main', () => ({
  setup: jest.fn()
}))

describe('index', () => {
  it('calls setup when imported', async () => {
    require('../src/index')

    expect(setup).toHaveBeenCalled()
  })
})
