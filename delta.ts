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
  description: "Delta Android key bypasser.",
  dmPermission: false,
  sage: {
    defer: false,
  },
};

export default async (
  interaction: CommandInteraction
): Promise<CommandResult> => {
  const modal = new ModalBuilder()
    .setTitle("Delta bypasser")
    .setCustomId("DELTA_MODAL")
    .addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setLabel("Delta link")
          .setStyle(TextInputStyle.Short)
          .setCustomId("DELTA_LINK")
          .setPlaceholder("Your Delta key link here...")
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(4000)
      )
    );

  await interaction.showModal(modal);
};
