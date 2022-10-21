import { ProgramMetadata } from '@gilder/gov-db-entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramMetadataService } from './program-metadata.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramMetadata])],
  providers: [ProgramMetadataService],
  exports: [ProgramMetadataService],
})
export class ProgramMetadataServiceModule {}
