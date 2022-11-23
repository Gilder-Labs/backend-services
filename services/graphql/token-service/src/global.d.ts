type Environment = 'development' | 'production' | 'test';

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: Environment;
  }
}
