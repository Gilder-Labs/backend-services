import { TokenOwnersService } from '@gilder/gov-service-module';
import { TokenOwner } from '@gilder/graphql-gov-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(TokenOwner)
export class TokenOwnersResolver {
  constructor(private readonly tokenOwnersService: TokenOwnersService) {}

  @Query(() => [TokenOwner])
  async tokenOwners(): Promise<TokenOwner[]> {
    return this.tokenOwnersService.getAll();
  }
}
