import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | undefined;

export class BaseTest {
  static async setup() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('MongoDB In-Memory Test DB connected');
    }
  }

  static async clear() {
    const db = mongoose.connection.db;
    if (!db) return;

    const collections = await db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }

  static async teardown() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
      console.log('MongoDB In-Memory Test DB disconnected');
      mongoServer = undefined;
    }
  }
}

export const withDatabase = (fn: () => void) => {
  beforeAll(() => BaseTest.setup());
  afterEach(() => BaseTest.clear());
  afterAll(() => BaseTest.teardown());
  fn();
};
