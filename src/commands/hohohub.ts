import { type CommandConfig, type CommandResult } from "robo.js";
import {
  type CommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export const config: CommandConfig = {
  description: "Hohohub key bypasser.",
  dmPermission: false,
  sage: {
    defer: false,
  },
};

export default async (
  interaction: CommandInteraction
): Promise<CommandResult> => {
  const modal = new ModalBuilder()
    .setTitle("Hohohub bypasser")
    .setCustomId("HOHOHUB_MODAL")
    .addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setLabel("Hohohub link")
          .setStyle(TextInputStyle.Short)
          .setCustomId("HOHOHUB_LINK")
          .setPlaceholder("Your Hohohub key link here...")
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(4000)
      )
    );

  await interaction.showModal(modal);
};
