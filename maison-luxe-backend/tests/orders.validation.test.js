const request = require('supertest')

jest.mock('../middleware/auth', () => ({
  protect: (req, _res, next) => {
    req.user = { _id: '507f191e810c19729de860ea', isAdmin: true }
    next()
  },
  admin: (_req, _res, next) => next(),
}))

const createMockOrder = (payload = {}) => ({
  _id: '507f191e810c19729de860ea',
  status: 'Pending',
  adminSeen: false,
  ...payload,
})

jest.mock('../models/Order', () => ({
  find: jest.fn(() => ({ populate: () => ({ sort: async () => [] }) })),
  countDocuments: jest.fn(async () => 0),
  updateMany: jest.fn(async () => ({ modifiedCount: 0 })),
  create: jest.fn(async (data) => createMockOrder(data)),
  findByIdAndUpdate: jest.fn(async (_id, payload) => createMockOrder(payload)),
}))

const { createApp } = require('../server')

describe('orders route validation', () => {
  it('rejects invalid order payload', async () => {
    const app = createApp()
    const res = await request(app).post('/api/orders').send({ items: [], total: 0 })
    expect(res.status).toBe(400)
  })

  it('rejects invalid status updates', async () => {
    const app = createApp()
    const res = await request(app)
      .put('/api/orders/507f191e810c19729de860ea/status')
      .send({ status: 'INVALID' })
    expect(res.status).toBe(400)
  })
})
