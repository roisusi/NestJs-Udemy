import { readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesRepository {
  async findAll() {
    const data = await readFile('./src/messages.json', 'utf8');
    return JSON.parse(data);
  }

  async findOne(id: string) {
    const data = await readFile('./src/messages.json', 'utf8');
    const message = JSON.parse(data);
    return message[id];
  }

  async create(content: string) {
    const data = await readFile('./src/messages.json', 'utf8');
    const message = JSON.parse(data);

    const id = Math.floor(Math.random() * 999);

    message[id] = { id, content };

    await writeFile('./src/messages.json', JSON.stringify(message));
  }
}
