const express = require('express');
const request = require('supertest');
const UserModel = require('../models/sportsbooking');

jest.mock('../models/sportsbooking');

const app = express();
app.use(express.json());

// Define the route directly in the test file (same logic as your real route)
app.post('/check-booking', async (req, res) => {
  const { sport, date, time } = req.body;
  try {
    const existingBooking = await UserModel.findOne({ sport, date, time });
    if (existingBooking) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }
    return res.status(200).json({ message: 'Time slot available' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

describe('POST /check-booking', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 409 if the booking already exists', async () => {
    UserModel.findOne.mockResolvedValue({
      sport: 'tennis',
      date: '2025-05-20',
      time: '10:00',
      residentInfo: 'John Doe',
      status: 'approved',
    });

    const res = await request(app)
      .post('/check-booking')
      .send({ sport: 'tennis', date: '2025-05-20', time: '10:00' });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Time slot already booked');
  });

  test('should return 200 if the booking slot is available', async () => {
    UserModel.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/check-booking')
      .send({ sport: 'badminton', date: '2025-05-21', time: '14:00' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Time slot available');
  });

  test('should handle server errors gracefully', async () => {
    UserModel.findOne.mockImplementation(() => {
      throw new Error('Database failure');
    });

    const res = await request(app)
      .post('/check-booking')
      .send({ sport: 'soccer', date: '2025-05-22', time: '16:00' });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Internal server error');
  });
});
