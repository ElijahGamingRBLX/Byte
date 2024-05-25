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
  description: "Vega X key bypasser.",
  dmPermission: false,
  sage: {
    defer: false,
  },
};

export default async (
  interaction: CommandInteraction
): Promise<CommandResult> => {
  const modal = new ModalBuilder()
    .setTitle("Vega X bypasser")
    .setCustomId("VEGAX_MODAL")
    .addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setLabel("Vega X link")
          .setStyle(TextInputStyle.Short)
          .setCustomId("VEGAX_LINK")
          .setPlaceholder("Your Vega X key link here...")
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(4000)
      )
    );

  await interaction.showModal(modal);
};
