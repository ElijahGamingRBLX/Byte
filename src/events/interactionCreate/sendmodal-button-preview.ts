import { UUID } from "node:crypto";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { getSettings } from "../../commands/send-modal.js";

export default async (interaction: ButtonInteraction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("SEND_MODAL_PREVIEW@")) return;
  const id = interaction.customId.split("@")[1] as UUID;

  try {
    const settings = await getSettings(id);
    if (!settings) return;
    if (settings.authorId !== interaction.user.id) {
      return;
    }

    if (settings.content && !settings.embeds) {
      await interaction.reply({
        content: settings.content,
        components: [
          new ActionRowBuilder<ButtonBuilder>() //
            .addComponents(
              new ButtonBuilder()
                .setLabel(`Enter ${settings.executor} URL [PREVIEW]`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔓")
                .setCustomId(`SEND_MODAL_PREVIEW_BUTTON@${id}`)
            ),
        ],
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
        .setTitle(
          `${settings.executor
            .replaceAll("fluxus", "Fluxus")
            .replaceAll("arceus", "Arceus X")
            .replaceAll("codex", "Codex")
            .replaceAll("delta", "Delta X")} Bypasser`
        )
        .setDescription(
          `Click the button below to bypass your ${settings.executor
            .replaceAll("fluxus", "Fluxus")
            .replaceAll("arceus", "Arceus X")
            .replaceAll("codex", "Codex")} key.`
        )
        .setColor("White")
        .setURL("https://discord.gg/kD3mujkFYn");
    }

    if (!settings.content) {
      await interaction.reply({
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>() //
            .addComponents(
              new ButtonBuilder()
                .setLabel(
                  `Enter ${settings.executor
                    .replaceAll("fluxus", "Fluxus")
                    .replaceAll("arceus", "Arceus X")
                    .replaceAll("delta", "Delta X")
                    .replaceAll("codex", "Codex")} URL [PREVIEW]`
                )
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔓")
                .setDisabled(true)
                .setCustomId(`SEND_MODAL_PREVIEW_BUTTON@${id}`)
            ),
        ],
        ephemeral: true,
      });
      return;
    } else {
      await interaction.reply({
        content: settings.content,
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>() //
            .addComponents(
              new ButtonBuilder()
                .setLabel(
                  `Enter ${settings.executor
                    .replaceAll("fluxus", "Fluxus")
                    .replaceAll("arceus", "Arceus X")
                    .replaceAll("delta", "Delta X")
                    .replaceAll("codex", "Codex")} URL [PREVIEW]`
                )
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("🔓")
                .setCustomId(`SEND_MODAL_PREVIEW_BUTTON@${id}`)
            ),
        ],
        ephemeral: true,
      });
      return;
    }
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
