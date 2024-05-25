import { UUID } from "node:crypto";
import {
  ColorResolvable,
  EmbedBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import {
  createSetupMessage,
  getSettings,
  updateSettings,
} from "../../commands/send-modal.js";

export default async (interaction: ModalSubmitInteraction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId.startsWith("SEND_MODAL_EDIT_CONTENT@")) {
    const id = interaction.customId.split("@")[1] as UUID;
    await interaction.deferUpdate();
    const settings = await getSettings(id);
    if (!settings) return;

    const content =
      interaction.fields.getTextInputValue("content") || undefined;

    const newSettings = await updateSettings(settings.id, {
      ...settings,
      content,
    });

    const setupMessage = createSetupMessage(interaction, newSettings);

    await interaction.editReply({
      content: setupMessage.content,
      components: setupMessage.components,
    });
    return;
  } else if (interaction.customId.startsWith("SEND_MODAL_EDIT_TITLE@")) {
    const id = interaction.customId.split("@")[1] as UUID;
    await interaction.deferUpdate();
    const settings = await getSettings(id);
    if (!settings) return;

    const title = interaction.fields.getTextInputValue("title") || undefined;

    const newSettings = await updateSettings(settings.id, {
      ...settings,
      embeds: {
        ...settings.embeds,
        title,
      },
    });

    const setupMessage = createSetupMessage(interaction, newSettings);

    await interaction.editReply({
      content: setupMessage.content,
      components: setupMessage.components,
    });
    return;
  } else if (interaction.customId.startsWith("SEND_MODAL_EDIT_DESCRIPTION@")) {
    const id = interaction.customId.split("@")[1] as UUID;
    await interaction.deferUpdate();
    const settings = await getSettings(id);
    if (!settings) return;

    const description =
      interaction.fields.getTextInputValue("description") || undefined;

    const newSettings = await updateSettings(settings.id, {
      ...settings,
      embeds: {
        ...settings.embeds,
        description,
      },
    });

    const setupMessage = createSetupMessage(interaction, newSettings);

    await interaction.editReply({
      content: setupMessage.content,
      components: setupMessage.components,
    });
    return;
  } else if (interaction.customId.startsWith("SEND_MODAL_EDIT_COLOR@")) {
    const id = interaction.customId.split("@")[1] as UUID;

    const settings = await getSettings(id);
    if (!settings) return;

    const color = interaction.fields.getTextInputValue("color") || undefined;
    if (!color) {
      await interaction.deferUpdate();
      const newSettings = await updateSettings(settings.id, {
        ...settings,
        embeds: {
          ...settings.embeds,
          color: undefined,
        },
      });

      const setupMessage = createSetupMessage(interaction, newSettings);

      await interaction.editReply({
        content: setupMessage.content,
        components: setupMessage.components,
      });
      return;
    }

    try {
      new EmbedBuilder().setColor(color as ColorResolvable).setTitle("TEST");
    } catch (error) {
      await interaction.reply({
        content: `The provided color \`${color}\` is not a valid hex (#FFFFFF) color`,
        ephemeral: true,
      });
      return;
    }

    await interaction.deferUpdate();
    const newSettings = await updateSettings(settings.id, {
      ...settings,
      embeds: {
        ...settings.embeds,
        color: color as ColorResolvable,
      },
    });

    const setupMessage = createSetupMessage(interaction, newSettings);

    await interaction.editReply({
      content: setupMessage.content,
      components: setupMessage.components,
    });
    return;
  } else if (interaction.customId.startsWith("SEND_MODAL_EDIT_THUMBNAIL@")) {
    const id = interaction.customId.split("@")[1] as UUID;
    const settings = await getSettings(id);
    if (!settings) return;

    const thumbnail =
      interaction.fields.getTextInputValue("thumbnail") || undefined;
    if (!thumbnail) {
      await interaction.deferUpdate();

      const newSettings = await updateSettings(settings.id, {
        ...settings,
        embeds: {
          ...settings.embeds,
          thumbnail: undefined,
        },
      });

      const setupMessage = createSetupMessage(interaction, newSettings);

      await interaction.editReply({
        content: setupMessage.content,
        components: setupMessage.components,
      });
      return;
    }

    try {
      new EmbedBuilder().setThumbnail(thumbnail);
    } catch (error) {
      await interaction.reply({
        content: `The provided thumbnail URL \`${thumbnail}\` is not a valid URL`,
        ephemeral: true,
      });
      return;
    }
    await interaction.deferUpdate();

    const newSettings = await updateSettings(settings.id, {
      ...settings,
      embeds: {
        ...settings.embeds,
        thumbnail,
      },
    });

    const setupMessage = createSetupMessage(interaction, newSettings);

    await interaction.editReply({
      content: setupMessage.content,
      components: setupMessage.components,
    });
    return;
  } else if (interaction.customId.startsWith("SEND_MODAL_EDIT_IMAGE@")) {
    const id = interaction.customId.split("@")[1] as UUID;
    const settings = await getSettings(id);
    if (!settings) return;

    const image = interaction.fields.getTextInputValue("image") || undefined;
    if (!image) {
      await interaction.deferUpdate();

      const newSettings = await updateSettings(settings.id, {
        ...settings,
        embeds: {
          ...settings.embeds,
          image,
        },
      });

      const setupMessage = createSetupMessage(interaction, newSettings);

      await interaction.editReply({
        content: setupMessage.content,
        components: setupMessage.components,
      });
      return;
    }

    try {
      new EmbedBuilder().setImage(image);
    } catch (error) {
      await interaction.reply({
        content: `The provided image URL \`${image}\` is not a valid URL`,
        ephemeral: true,
      });
      return;
    }

    await interaction.deferUpdate();

    const newSettings = await updateSettings(settings.id, {
      ...settings,
      embeds: {
        ...settings.embeds,
        image,
      },
    });

    const setupMessage = createSetupMessage(interaction, newSettings);

    await interaction.editReply({
      content: setupMessage.content,
      components: setupMessage.components,
    });
    return;
  } else if (interaction.customId.startsWith("SEND_MODAL_EDIT_FOOTER@")) {
    const id = interaction.customId.split("@")[1] as UUID;
    const settings = await getSettings(id);
    if (!settings) return;

    const footer = interaction.fields.getTextInputValue("footer") || undefined;
    const footerIcon =
      interaction.fields.getTextInputValue("footerIcon") || undefined;

    if (!footer && footerIcon) {
      await interaction.reply({
        content: "Please provide a footer text if you want to set an icon",
        ephemeral: true,
      });
      return;
    }

    if (footerIcon) {
      try {
        new EmbedBuilder().setFooter({
          text: footer ?? "test",
          iconURL: footerIcon,
        });
      } catch (error) {
        await interaction.reply({
          content: `The provided footer icon URL \`${footerIcon}\` is not a valid URL`,
          ephemeral: true,
        });
        return;
      }
    }

    await interaction.deferUpdate();

    const newSettings = await updateSettings(settings.id, {
      ...settings,
      embeds: {
        ...settings.embeds,
        footer: {
          text: footer,
          icon: footerIcon,
        },
      },
    });

    const setupMessage = createSetupMessage(interaction, newSettings);

    await interaction.editReply({
      content: setupMessage.content,
      components: setupMessage.components,
    });
    return;
  }
};
