// 簡單的 JavaScript 測試文件
describe('Basic Test', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle basic operations', () => {
    expect('hello').toBe('hello')
    expect([1, 2, 3]).toHaveLength(3)
  })
})

describe('Math Operations', () => {
  it('should add numbers correctly', () => {
    expect(2 + 3).toBe(5)
  })

  it('should multiply numbers correctly', () => {
    expect(4 * 5).toBe(20)
  })
}) 