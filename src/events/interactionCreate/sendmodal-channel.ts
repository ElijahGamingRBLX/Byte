import { ChannelSelectMenuInteraction } from "discord.js";
import {
  createSetupMessage,
  getSettings,
  updateSettings,
} from "../../commands/send-modal.js";
import { UUID } from "node:crypto";

export default async (interaction: ChannelSelectMenuInteraction) => {
  if (!interaction.isChannelSelectMenu()) return;
  if (!interaction.customId.startsWith("SEND_MODAL_CHANNEL_SELECT@")) return;
  await interaction.deferUpdate();
  const id = interaction.customId.split("@")[1] as UUID;

  const settings = await getSettings(id);
  if (!settings) return;

  if (settings.authorId !== interaction.user.id) {
    return;
  }

  const newSettings = await updateSettings(settings.id, {
    ...settings,
    channelId: interaction.values[0],
  });

  const setupMessage = createSetupMessage(interaction, newSettings);

  await interaction.editReply({
    content: setupMessage.content,
    components: setupMessage.components,
  });
};
