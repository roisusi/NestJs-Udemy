import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateMessagesDto } from './Dtos/create-messages.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(public messagesService: MessagesService) {}

  @Post()
  createMessage(@Body() body: CreateMessagesDto) {
    return this.messagesService.create(body.content);
  }

  @Get()
  listMessages() {
    return this.messagesService.findAll();
  }

  @Get('/:id')
  async getMessage(@Param('id') id: any) {
    const message = await this.messagesService.findOne(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }
}
