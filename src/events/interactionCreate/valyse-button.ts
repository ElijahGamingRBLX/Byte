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
  if (!interaction.customId.startsWith("BYPASS@VALYSE")) return;
  const ephemeral = interaction.customId.split("@")[2] === "EPHEMERAL";

  const modal = new ModalBuilder()
    .setTitle("Valyse bypasser")
    .setCustomId(`VALYSE_MODAL${ephemeral ? "@EPHEMERAL" : ""}`)
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
