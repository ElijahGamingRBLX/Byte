export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT_ID: string;
      DISCORD_TOKEN: string;

      COMMAND_LOG_WEBHOOK: string;

      API_KEY: string;
      API_URL: string;
    }
  }
}
