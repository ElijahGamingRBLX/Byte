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
  if (!interaction.customId.startsWith("BYPASS@VEGAX")) return;
  const ephemeral = interaction.customId.split("@")[2] === "EPHEMERAL";

  const modal = new ModalBuilder()
    .setTitle("Vega X bypasser")
    .setCustomId(`VEGAX_MODAL${ephemeral ? "@EPHEMERAL" : ""}`)
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
