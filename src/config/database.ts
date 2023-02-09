import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default prisma;


export let prismaClient: PrismaClient;
export function connectDb(): void {
  prismaClient = new PrismaClient();
}

export async function disconnectDB(): Promise<void> {
  await prisma?.$disconnect();
}
