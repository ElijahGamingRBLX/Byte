// @ts-check

import { Partials } from "discord.js";

/**
 * @type {import('@roboplay/robo.js').Config}
 **/
export default {
  clientOptions: {
    intents: ["Guilds"],
    partials: [
      Partials.Channel,
      Partials.Message,
      Partials.User,
      Partials.GuildMember,
      Partials.Reaction,
    ],
    allowedMentions: {
      repliedUser: false,
    },
  },
  plugins: [],
  defaults: {
    help: false,
  },
  sage: {
    errorChannelId: "1205462769248370708",
    errorReplies: true,
    errorMessage: `**Something went wrong! Please try again later.**

  *If you continue to encounter this message, kindly [join our Discord server](https://discord.gg/5WdcdzkaT8)!*`,
  },
  type: "robo",
};
