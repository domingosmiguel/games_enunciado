import { faker } from '@faker-js/faker';
import prisma from 'config/database';
import { createConsole } from './console-factory';

export async function createGame(incomingConsole?: Console) {
  const console = incomingConsole || ((await createConsole()) as Console);
  return await prisma.game.create({
    data: {
      title: faker.random.words(2),
      consoleId: console.id,
    },
  });
}

type Console = {
  id: number;
  name: string;
};
