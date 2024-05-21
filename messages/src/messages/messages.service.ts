import { MessagesRepository } from './messages.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  constructor(public messagesRepository: MessagesRepository) {}

  findAll() {
    return this.messagesRepository.findAll();
  }

  findOne(id: string) {
    return this.messagesRepository.findOne(id);
  }

  create(content: string) {
    return this.messagesRepository.create(content);
  }
}
