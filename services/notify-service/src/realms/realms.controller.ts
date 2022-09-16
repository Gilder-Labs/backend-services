import { Realm } from '@gilder/db-entities';
import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('realms')
export class RealmsController {
  constructor(
    @InjectRepository(Realm)
    private readonly realmRepository: Repository<Realm>,
  ) {}
}
