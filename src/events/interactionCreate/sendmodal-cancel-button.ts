import { UUID } from "node:crypto";
import { ButtonInteraction } from "discord.js";
import { getSettings } from "../../commands/send-modal.js";
import { Flashcore } from "robo.js";

export default async (interaction: ButtonInteraction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("SEND_MODAL_CANCEL@")) return;
  const id = interaction.customId.split("@")[1] as UUID;
  await interaction.deferUpdate();

  const settings = await getSettings(id);
  if (!settings) return await interaction.deleteReply();

  if (settings.authorId !== interaction.user.id) {
    return;
  }

  await interaction.deleteReply();

  await Flashcore.delete(`__send-modal__@${id}`);
};
