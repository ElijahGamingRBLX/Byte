import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export default async (interaction: ButtonInteraction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("BYPASS@HYDROGEN")) return;
  const ephemeral = interaction.customId.split("@")[2] === "EPHEMERAL";

  const modal = new ModalBuilder()
    .setTitle("Hydrogen bypasser")
    .setCustomId(`HYDROGEN_MODAL${ephemeral ? "@EPHEMERAL" : ""}`)
    .addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setLabel("Hydrogen link")
          .setStyle(TextInputStyle.Short)
          .setCustomId("HYDROGEN_LINK")
          .setPlaceholder("Your Hydrogen key link here...")
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(4000)
      )
    );

  await interaction.showModal(modal);
};
