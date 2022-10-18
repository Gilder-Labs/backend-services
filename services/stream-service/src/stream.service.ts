import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { tryGetRealmData } from '@gilder/utilities';
import { PublicKey } from '@solana/web3.js';

const PROTO_PATH = './proto/octavestream.proto';
let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { octavestream } = grpc.loadPackageDefinition(packageDefinition);

@Injectable()
export class StreamService implements OnModuleInit {
  private readonly logger = new Logger(StreamService.name);

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    const access_token = await this.getAccessToken();

    //@ts-ignore
    const client = new octavestream.OctaveStream(
      this.configService.get<string>('OCTAVE_STREAM_ENDPOINT'),
      grpc.credentials.createInsecure(),
      {
        'grpc.max_receive_message_length': 1024 * 1024 * 100,
      },
    );

    const subscribeMessage = {
      access_token,
      owners: ['6jydyMWSqV2bFHjCHydEQxa9XfXQWDwjVqAdjBEA1BXx'],
      mentions: ['*'],
      slot_updates: true,
    };

    const connect = () => {
      const subscription = client.subscribe(subscribeMessage);

      subscription.on('data', (message) => {
        this.logger.log(message);
        if (message.account_write) {
          const pubKey = new PublicKey(message.account_write.pubkey);
          const foo = tryGetRealmData(pubKey, message.account_write);
          if (foo) {
            this.logger.log(foo);
          }
        }
      });

      subscription.on('end', () => connect());
      subscription.on('error', (error) => {
        this.logger.error(error);
        connect();
      });
    };

    connect();
  }

  private async getAccessToken(): Promise<string> {
    const {
      data: { access_token },
    } = await firstValueFrom(
      this.httpService.post(
        this.configService.get<string>('OCTAVE_OAUTH_URL'),
        {
          client_id: this.configService.get<string>('OCTAVE_CLIENT_ID'),
          client_secret: this.configService.get<string>('OCTAVE_CLIENT_SECRET'),
          audience: this.configService.get<string>('OCTAVE_AUDIENCE'),
          grant_type: 'client_credentials',
        },
      ),
    );

    return access_token;
  }
}
