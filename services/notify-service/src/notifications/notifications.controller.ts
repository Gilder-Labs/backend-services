import {
  NotificationSubscriptionsService,
  NotifyData,
} from '@gilder/notification-subscriptions-module';
import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';

@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(
    private readonly notificationService: NotificationSubscriptionsService,
  ) {}

  @Post('subscribe')
  async subscribe(@Body() data: NotifyData) {
    try {
      return await this.notificationService.subscribe(data);
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
      throw new BadRequestException();
    }
  }

  @Post('unsubscribe')
  async unsubscribe(@Body() data: NotifyData) {
    try {
      return await this.notificationService.unsubscribe(data);
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
      throw new BadRequestException();
    }
  }

  @Post('listSubscriptions')
  async getDeviceSubscriptions(@Body() data: { mobileToken: string }) {
    try {
      return await this.notificationService.getByMobileToken(data.mobileToken);
    } catch (e) {
      this.logger.error(`Something went wrong. Error: ${e}`);
      throw new BadRequestException();
    }
  }
}
