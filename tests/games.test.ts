import { faker } from '@faker-js/faker';
import app from 'app';
import prisma, { connectDb } from 'config/database';
import supertest from 'supertest';
import { createConsole } from './factories/console-factory';
import { createGame } from './factories/game-factory';

beforeAll(async () => {
  await connectDb();
});

beforeEach(async () => {
  await prisma.game.deleteMany({});
  await prisma.console.deleteMany({});
});

const server = supertest(app);

describe('GET /games', () => {
  it('should respond with status 200 and an array of data', async () => {
    await createGame();

    const response = await server.get('/games');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          consoleId: expect.any(Number),
        }),
      ])
    );
  });
});

describe('GET /games/:id', () => {
  it('should respond 404 when there is no game', async () => {
    const response = await server.get('/games/0');

    expect(response.status).toBe(404);
  });

  it('should respond with status 200 and an array of data', async () => {
    const game = await createGame();

    const response = await server.get(`/games/${game.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: game.id,
      title: game.title,
      consoleId: game.consoleId,
    });
  });
});

describe('POST /games', () => {
  it('should return 422 when body is invalid', async () => {
    const body = {};
    const response = await server.post('/games').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 201 when body is valid', async () => {
    const console = await createConsole();
    const body = { title: faker.random.words(2), consoleId: console.id };
    const response = await server.post('/games').send(body);

    expect(response.status).toBe(201);
  });
});
