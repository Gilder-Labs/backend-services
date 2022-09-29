import {
  NotificationSubscriptionsService,
  NotifyData,
} from '@gilder/notification-subscriptions-module';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(
    private readonly notificationService: NotificationSubscriptionsService,
  ) {}

  @Post('subscribe')
  subscribe(@Body() data: NotifyData) {
    return this.notificationService.subscribe(data);
  }

  @Get('listSubscriptions/:mobileToken')
  getDeviceSubscriptions(@Param('mobileToken') mobileToken: string) {
    return this.notificationService.getByMobileToken(mobileToken);
  }
}
