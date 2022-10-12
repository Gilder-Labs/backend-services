import { TokenOwnersService } from '@gilder/token-owners-module';
import { TokenOwner } from '@gilder/graphql-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(TokenOwner)
export class TokenOwnersResolver {
  constructor(private readonly tokenOwnersService: TokenOwnersService) {}

  @Query(() => [TokenOwner])
  async tokenOwners(): Promise<TokenOwner[]> {
    return this.tokenOwnersService.getAllTokenOwners();
  }

  @Query(() => [TokenOwner])
  async uniqueTokenOwners(): Promise<TokenOwner[]> {
    return this.tokenOwnersService.getUniqueTokenOwners();
  }
}
