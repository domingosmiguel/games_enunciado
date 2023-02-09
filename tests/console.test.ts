import app from 'app';
import prisma, { connectDb } from 'config/database';
import supertest from 'supertest';
import { createConsole } from './factories/console-factory';

beforeAll(async () => {
  await connectDb();
});

beforeEach(async () => {
  await prisma.game.deleteMany({});
  await prisma.console.deleteMany({});
});

const server = supertest(app);

describe('GET /consoles', () => {
  it('should respond with status 200 and an array of data', async () => {
    await createConsole();

    const response = await server.get('/consoles');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      ])
    );
  });
});

describe('GET /consoles/:id', () => {
  it('should respond 404 when there is no console', async () => {
    const response = await server.get('/consoles/jsdngisidgb');

    expect(response.status).toBe(404);
  });

  it('should respond with status 200 and an array of data', async () => {
    const console = await createConsole();

    const response = await server.get(`/consoles/${console.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
      })
    );
  });
});

describe('POST /consoles', () => {
  it('should return 422 when body is invalid', async () => {
    const body = {};
    const response = await server.post('/consoles').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 201 when body is valid', async () => {
    const body = { name: 'Sara' };
    const response = await server.post('/consoles').send(body);

    expect(response.status).toBe(201);
  });
});
