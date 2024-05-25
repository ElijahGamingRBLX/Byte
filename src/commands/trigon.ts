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
  description: "Trigon key bypasser.",
  dmPermission: false,
  sage: {
    defer: false,
  },
};

export default async (
  interaction: CommandInteraction
): Promise<CommandResult> => {
  const modal = new ModalBuilder()
    .setTitle("Trigon bypasser")
    .setCustomId("TRIGON_MODAL")
    .addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setLabel("Trigon link")
          .setStyle(TextInputStyle.Short)
          .setCustomId("TRIGON_LINK")
          .setPlaceholder("Your Trigon key link here...")
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(4000)
      )
    );

  await interaction.showModal(modal);
};
