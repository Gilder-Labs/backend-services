import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotifyData } from './types';

@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('subscribe')
  subscribe(@Body() data: NotifyData) {
    return this.notificationService.subscribe(data);
  }

  @Get('listSubscriptions/:mobileToken')
  getDeviceSubscriptions(@Param('mobileToken') mobileToken: string) {
    return mobileToken;
  }
}
