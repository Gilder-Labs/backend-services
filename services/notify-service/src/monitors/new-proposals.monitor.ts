import { Injectable, Logger } from '@nestjs/common';
import { RealmsService } from '../realms/realms.service';

@Injectable()
export class NewProposalsMonitoringService {
  private readonly logger = new Logger(NewProposalsMonitoringService.name);

  constructor(private readonly realmsService: RealmsService) {}
}
