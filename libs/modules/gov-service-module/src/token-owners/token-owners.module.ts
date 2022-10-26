import { TokenOwner } from '@gilder/gov-db-entities';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TokenOwnersService } from './token-owners.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokenOwner])],
  providers: [TokenOwnersService],
  exports: [TokenOwnersService],
})
export class TokenOwnersServiceModule {
  static register(dataSource?: string): DynamicModule {
    const provider: Provider<any> = {
      provide: 'TOKEN_OWNER_SERVICE',
      useFactory: (repo) => new TokenOwnersService(repo),
      inject: [getRepositoryToken(TokenOwner, dataSource)],
    };
    return {
      module: TokenOwnersServiceModule,
      imports: [TypeOrmModule.forFeature([TokenOwner], dataSource)],
      providers: [provider],
      exports: [provider],
    };
  }
}
