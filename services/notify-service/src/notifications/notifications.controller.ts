import { Realm } from '@gilder/db-entities';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

type NotificationType = 'newProposals';

interface NotifyData {
  type: NotificationType;
  mobileToken: string;
  realm: string;
  unsubscribe: boolean;
}

@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectRepository(Realm)
    private readonly realmRepository: Repository<Realm>,
  ) {}

  @Post('subscribe')
  subscribe(@Body() data: NotifyData) {
    return data;
  }

  @Get('listSubscriptions/:mobileToken')
  getDeviceSubscriptions(@Param('mobileToken') mobileToken: string) {
    return mobileToken;
  }
}
