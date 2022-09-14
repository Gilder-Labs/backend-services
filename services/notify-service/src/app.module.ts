import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataConfig } from './data-source';
import { RealmsModule } from './realms/realms.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataConfig), RealmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
