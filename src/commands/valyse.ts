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
  description: "Valyse key bypasser.",
  dmPermission: false,
  sage: {
    defer: false,
  },
};

export default async (
  interaction: CommandInteraction
): Promise<CommandResult> => {
  const modal = new ModalBuilder()
    .setTitle("Valyse bypasser")
    .setCustomId("VALYSE_MODAL")
    .addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setLabel("Valyse link")
          .setStyle(TextInputStyle.Short)
          .setCustomId("VALYSE_LINK")
          .setPlaceholder("Your Valyse key link here...")
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(4000)
      )
    );

  await interaction.showModal(modal);
};
