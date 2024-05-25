import { UUID } from "node:crypto";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { getSettings } from "../../commands/send-modal.js";
import { Flashcore } from "robo.js";

export default async (interaction: ButtonInteraction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("SEND_MODAL_FINISH@")) return;
  const id = interaction.customId.split("@")[1] as UUID;

  try {
    const settings = await getSettings(id);
    if (!settings) return;

    if (settings.authorId !== interaction.user.id) {
      return;
    }

    if (!settings.channelId) {
      await interaction.reply({
        content: "Please set the channel first before finishing.",
        ephemeral: true,
      });
      return;
    }

    const channel = await interaction.guild?.channels?.fetch(
      settings.channelId
    );
    if (!channel) {
      await interaction.reply({
        content: "The selected channel no longer exists.",
        ephemeral: true,
      });
      return;
    }

    if (!channel.isTextBased()) {
      await interaction.reply({
        content: "The selected channel is not a text channel.",
        ephemeral: true,
      });
      return;
    }

    const me = await channel.guild.members.fetchMe();
    if (!channel.permissionsFor(me)?.has("SendMessages")) {
      await interaction.reply({
        content: "I don't have permission to send messages on that channel.",
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder();

    if (settings.embeds?.title) embed.setTitle(settings.embeds.title);
    if (settings.embeds?.description)
      embed.setDescription(settings.embeds.description);
    if (settings.embeds?.color) embed.setColor(settings.embeds.color);
    if (settings.embeds?.image) embed.setImage(settings.embeds.image);
    if (settings.embeds?.thumbnail)
      embed.setThumbnail(settings.embeds.thumbnail);
    if (settings.embeds?.footer)
      embed.setFooter({
        text: settings.embeds.footer.text ?? "\u200b",
        iconURL: settings.embeds.footer.icon,
      });

    if (
      !settings.embeds?.title &&
      !settings.embeds?.description &&
      !settings.embeds?.color &&
      !settings.embeds?.image &&
      !settings.embeds?.thumbnail &&
      !settings.embeds?.footer &&
      !settings.content
    ) {
      embed
        .setTitle(`${settings.executor} Bypasser`)
        .setDescription(
          `Click the button below to bypass your ${settings.executor} key.`
        )
        .setColor("White")
        .setURL("https://discord.gg/kD3mujkFYn");
    }

    if (!settings.content) {
      await channel.send({
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>() //
            .addComponents(
              new ButtonBuilder()
                .setLabel(`Enter ${settings.executor} URL`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔓")
                .setDisabled(false)
                .setCustomId(
                  `BYPASS@${settings.executor
                    .toUpperCase()
                    .replaceAll(" ", "")}@EPHEMERAL`
                )
            ),
        ],
      });
      await Flashcore.delete(`__send-modal__@${id}`);
      await interaction.deferUpdate();
      await interaction.deleteReply();
      return;
    }

    await channel.send({
      content: settings.content,
      embeds: [embed],
      components: [
        new ActionRowBuilder<ButtonBuilder>() //
          .addComponents(
            new ButtonBuilder()
              .setLabel(`Enter ${settings.executor} URL`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("🔓")
              .setDisabled(false)
              .setCustomId(
                `BYPASS@${settings.executor
                  .toUpperCase()
                  .replaceAll(" ", "")}@EPHEMERAL`
              )
          ),
      ],
    });
    await Flashcore.delete(`__send-modal__@${id}`);
    await interaction.deferUpdate();
    await interaction.deleteReply();
  } catch (error) {
    await interaction.reply({
      content: `${
        error instanceof Error
          ? error.message
          : "Something happened while trying to request to send the embed! Please try again."
      }`,
      ephemeral: true,
    });
    return;
  }
};
