import { TokenOwnersService } from '@gilder/gov-service-module';
import { TokenOwner } from '@gilder/graphql-gov-models';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GovernanceAccountType } from '@solana/spl-governance';

@Resolver(TokenOwner)
export class TokenOwnersResolver {
  constructor(private readonly tokenOwnersService: TokenOwnersService) {}

  @Query(() => [TokenOwner])
  async tokenOwners(): Promise<TokenOwner[]> {
    return this.tokenOwnersService.getAll();
  }

  @Query(() => [TokenOwner])
  async getTokenOwnersByRealm(
    @Args('realmPk') realmPk: string,
  ): Promise<TokenOwner[]> {
    return this.tokenOwnersService.filterBy({
      realmPk,
    });
  }

  @Query(() => [TokenOwner])
  async tokenOwnersV1(): Promise<TokenOwner[]> {
    return this.tokenOwnersService.filterBy({
      accountType: GovernanceAccountType.TokenOwnerRecordV1,
    });
  }

  @Query(() => [TokenOwner])
  async tokenOwnersV2(): Promise<TokenOwner[]> {
    return this.tokenOwnersService.filterBy({
      accountType: GovernanceAccountType.TokenOwnerRecordV2,
    });
  }
}
