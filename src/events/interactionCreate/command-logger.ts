import {
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
  WebhookClient,
} from "discord.js";
import { logger as defaultLogger, color } from "robo.js";
const discordLogger = defaultLogger.fork("discord");
export default async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) return;

  if (!process.env.COMMAND_LOG_WEBHOOK)
    return discordLogger.warn(
      `${color.bold(
        "COMMAND_LOGGER.WEBHOOK"
      )} is not set! Skipping command logger.`
    );
  if (!process.env.COMMAND_LOG_WEBHOOK.startsWith("https://discord.com/api/webhooks/"))
    return discordLogger.warn(
      `COMMAND_LOGGER.WEBHOOK is not a valid webhook! Skipping command logger.`
    );
  const webhook = new WebhookClient({ url: process.env.COMMAND_LOG_WEBHOOK });

  const embed = new EmbedBuilder()
    .setColor("White")
    .setThumbnail(
      interaction.user.avatar
        ? interaction.user.displayAvatarURL()
        : interaction.guild?.icon
        ? interaction.guild.iconURL()
        : null
    )
    .addFields(
      {
        name: "Command",
        value: `</${interaction.commandName}:${interaction.commandId}>`,
      },
      {
        name: "Guild",
        value: `${
          interaction.inGuild()
            ? `${interaction.guild?.name} \`(${interaction.guild?.id})\``
            : "DMs"
        }`,
      },
      {
        name: "Channel",
        value: `${
          interaction.channel instanceof TextChannel
            ? interaction.channel.name
            : "DMs"
        } \`(${interaction.channel?.id})\``,
      },
      {
        name: "User",
        value: `${interaction.user.tag} \`(${interaction.user.id})\``,
      }
    )
    .setTimestamp();

  await webhook.send({ embeds: [embed] }).catch((e) => discordLogger.error(e));
};
