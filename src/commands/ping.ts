import { client, type CommandConfig } from "robo.js";

export const config: CommandConfig = {
  description: "Replies with Pong!",
};

export default () => {
  return {
    content: `**Pong!** Latency: \`${client.ws.ping}ms\``,
    ephemeral: true,
  };
};
