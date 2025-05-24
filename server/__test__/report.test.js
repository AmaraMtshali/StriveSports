const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ReportModel = require('../models/reports');

// Extend Jest timeout to 30 seconds (default is only 5 seconds)
jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await ReportModel.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('ReportModel', () => {

  test('should create a report with default status "Pending"', async () => {
    const report = new ReportModel({
      facility: 'Gym',
      issue: 'Broken treadmill',
      residentInfo: 'John Doe'
    });

    const saved = await report.save();

    expect(saved._id).toBeDefined();
    expect(saved.status).toBe('Pending');
    expect(saved.facility).toBe('Gym');
    expect(saved.issue).toBe('Broken treadmill');
    expect(saved.residentInfo).toBe('John Doe');
  });

  test('should allow setting status to "In progress" or "Done"', async () => {
    const report = new ReportModel({
      facility: 'Pool',
      issue: 'Water leakage',
      residentInfo: 'Jane Doe',
      status: 'In progress'
    });

    const saved = await report.save();

    expect(saved.status).toBe('In progress');

    saved.status = 'Done';
    const updated = await saved.save();
    expect(updated.status).toBe('Done');
  });

  test('should not allow invalid status values', async () => {
    const report = new ReportModel({
      facility: 'Court',
      issue: 'Net missing',
      residentInfo: 'Mark Smith',
      status: 'Cancelled' // Invalid
    });

    let error;
    try {
      await report.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
    expect(error.errors.status.kind).toBe('enum');
  });

});
