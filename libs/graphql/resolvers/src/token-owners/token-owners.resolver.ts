import { TokenOwnersService } from '@gilder/token-owners-module';
import { TokenOwner } from '@gilder/graphql-models';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver(TokenOwner)
export class TokenOwnersResolver {
  constructor(private readonly tokenOwnersService: TokenOwnersService) {}

  @Query(() => [TokenOwner])
  async tokenOwners(): Promise<TokenOwner[]> {
    return (await this.tokenOwnersService.getAllTokenOwners()).map((x) => ({
      ...x,
      ownerPk: x.ownerPk.toBase58(),
      realmPk: x.realmPk.toBase58(),
      governanceDelegatePk: x.governanceDelegatePk?.toBase58(),
      governingTokenMintPk: x.governingTokenMintPk.toBase58(),
      governingTokenOwnerPk: x.governingTokenOwnerPk.toBase58(),
      governingTokenDespositAmount: x.governingTokenDespositAmount.toString(),
    }));
  }

  @Query(() => [TokenOwner])
  async uniqueTokenOwners(): Promise<TokenOwner[]> {
    return (await this.tokenOwnersService.getUniqueTokenOwners()).map((x) => ({
      ...x,
      ownerPk: x.ownerPk.toBase58(),
      realmPk: x.realmPk.toBase58(),
      governanceDelegatePk: x.governanceDelegatePk?.toBase58(),
      governingTokenMintPk: x.governingTokenMintPk.toBase58(),
      governingTokenOwnerPk: x.governingTokenOwnerPk.toBase58(),
      governingTokenDespositAmount: x.governingTokenDespositAmount.toString(),
    }));
  }
}
