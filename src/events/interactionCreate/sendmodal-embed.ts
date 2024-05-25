import { Flashcore } from "robo.js";
import { UUID } from "crypto";
import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  StringSelectMenuInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { SendModalSettings } from "../../types";

export default async (interaction: StringSelectMenuInteraction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (!interaction.customId.startsWith("SEND_MODAL_EDIT_EMBED@")) return;
  const id = interaction.customId.split("@")[1] as UUID;

  const settings = await Flashcore.get<SendModalSettings>(
    `__send-modal__@${id}`
  );
  if (!settings) return;
  if (settings.authorId !== interaction.user.id) {
    return;
  }

  const value = interaction.values[0];
  if (value === "content") {
    const modal = new ModalBuilder() //
      .setCustomId(`SEND_MODAL_EDIT_CONTENT@${id}`)
      .setTitle("Edit content");

    const content = new TextInputBuilder()
      .setCustomId("content")
      .setLabel("Content")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(2048);

    if (settings.content) {
      content.setValue(settings.content);
    }

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>() //
      .addComponents(content);

    modal.addComponents(row);
    await interaction.showModal(modal);
  } else if (value === "title") {
    const modal = new ModalBuilder() //
      .setCustomId(`SEND_MODAL_EDIT_TITLE@${id}`)
      .setTitle("Edit title");

    const title = new TextInputBuilder() //
      .setCustomId("title")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(256);

    if (settings.embeds?.title) {
      title.setValue(settings.embeds.title);
    }

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>() //
      .addComponents(title);

    modal.addComponents(row);
    await interaction.showModal(modal);
  } else if (value === "description") {
    const modal = new ModalBuilder() //
      .setCustomId(`SEND_MODAL_EDIT_DESCRIPTION@${id}`)
      .setTitle("Edit description");

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("Description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(2048);

    if (settings.embeds?.description) {
      description.setValue(settings.embeds.description);
    }

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>() //
      .addComponents(description);

    modal.addComponents(row);
    await interaction.showModal(modal);
  } else if (value === "color") {
    const modal = new ModalBuilder() //
      .setCustomId(`SEND_MODAL_EDIT_COLOR@${id}`)
      .setTitle("Edit color");

    const color = new TextInputBuilder()
      .setCustomId("color")
      .setLabel("Color")
      .setPlaceholder("#FFFFFF")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(7);

    if (settings.embeds?.color) {
      color.setValue(settings.embeds.color.toString());
    }

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>() //
      .addComponents(color);

    modal.addComponents(row);
    await interaction.showModal(modal);
  } else if (value === "thumbnail") {
    const modal = new ModalBuilder() //
      .setCustomId(`SEND_MODAL_EDIT_THUMBNAIL@${id}`)
      .setTitle("Edit thumbnail");

    const thumbnail = new TextInputBuilder()
      .setCustomId("thumbnail")
      .setLabel("Thumbnail")
      .setPlaceholder("https://example.com/image.png")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(256);

    if (settings.embeds?.thumbnail) {
      thumbnail.setValue(settings.embeds.thumbnail);
    }

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>() //
      .addComponents(thumbnail);

    modal.addComponents(row);
    await interaction.showModal(modal);
  } else if (value === "image") {
    const modal = new ModalBuilder() //
      .setCustomId(`SEND_MODAL_EDIT_IMAGE@${id}`)
      .setTitle("Edit image");

    const image = new TextInputBuilder() //
      .setCustomId("image")
      .setLabel("Image")
      .setPlaceholder("https://example.com/image.png")
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(256);

    if (settings.embeds?.image) {
      image.setValue(settings.embeds.image);
    }

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>() //
      .addComponents(image);

    modal.addComponents(row);
  } else if (value === "footer") {
    const modal = new ModalBuilder() //
      .setCustomId(`SEND_MODAL_EDIT_FOOTER@${id}`)
      .setTitle("Edit footer");

    const footerText = new TextInputBuilder()
      .setCustomId("footerText")
      .setLabel("Footer text")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(2048);

    if (settings.embeds?.footer?.text) {
      footerText.setValue(settings.embeds.footer.text);
    }

    const footerIcon = new TextInputBuilder()
      .setCustomId("footerIcon")
      .setLabel("Footer icon")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("https://example.com/image.png")
      .setRequired(false)
      .setMaxLength(256);

    if (settings.embeds?.footer?.icon) {
      footerIcon.setValue(settings.embeds.footer.icon);
    }

    const rows = [
      new ActionRowBuilder<ModalActionRowComponentBuilder>() //
        .addComponents(footerText),
      new ActionRowBuilder<ModalActionRowComponentBuilder>() //
        .addComponents(footerIcon),
    ];

    modal.addComponents(...rows);
    await interaction.showModal(modal);
  }
};
