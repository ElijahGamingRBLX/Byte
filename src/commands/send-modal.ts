import {
  Flashcore,
  type CommandConfig,
  type CommandResult,
  logger,
} from "robo.js";
import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  CommandInteraction,
  InteractionReplyOptions,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { SendModalSettings } from "../types";
import { type UUID, randomUUID } from "node:crypto";
import { SUPPORTED_EXECUTORS } from "../core/constants.js";
export const config: CommandConfig = {
  description: "...",
  dmPermission: false,
  options: [
    {
      name: "executor",
      choices: SUPPORTED_EXECUTORS.map((executor) => ({
        name: executor,
        value: executor,
      })),
      type: "string",
      required: true,
    },
  ],
};

export default async (
  interaction: CommandInteraction
): Promise<CommandResult> => {
  if (!interaction.memberPermissions?.has("ManageGuild")) {
    return {
      content:
        "This command can only be used by server manager (users with Manage Guild permission).",
      ephemeral: true,
    };
  }

  const id = randomUUID();
  const settings: SendModalSettings = {
    id,
    authorId: interaction.user.id,
    executor: interaction.options.get("executor")?.value as string,
  };

  await Flashcore.set<SendModalSettings>(`__send-modal__@${id}`, settings);
  const setupMessage = createSetupMessage(interaction, settings);
  return {
    content: setupMessage.content,
    components: setupMessage.components,
  };
};

export function createSetupMessage(
  interaction: BaseInteraction,
  settings: SendModalSettings
): InteractionReplyOptions {
  let extraInfo = "";

  if (settings.channelId) {
    const channel = interaction.guild?.channels?.cache?.get(settings.channelId);
    extraInfo = `- **Channel**: ${channel?.toString() ?? "Unknown"}\n`;
  } else {
    extraInfo = "- **Channel** are where the embed will be sent\n";
  }

  if (extraInfo) {
    extraInfo = `${extraInfo}\n`;
  }

  const channelSelectMenu = new ChannelSelectMenuBuilder()
    .setPlaceholder("Select a channel where the embed will be sent")
    .setCustomId(`SEND_MODAL_CHANNEL_SELECT@${settings.id}`)
    .addChannelTypes(ChannelType.GuildText)
    .setMinValues(1)
    .setMaxValues(1);

  const editEmbedSelectMenu = new StringSelectMenuBuilder()
    .setPlaceholder("Customize the embed")
    .setMaxValues(1)
    .setCustomId(`SEND_MODAL_EDIT_EMBED@${settings.id}`)
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Edit message content")
        .setValue("content")
        .setDescription("Edit the message content of the embed")
        .setEmoji("✏️"),
      new StringSelectMenuOptionBuilder() //
        .setLabel("Edit title")
        .setValue("title")
        .setDescription("Edit the title of the embed")
        .setEmoji("🏷️"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Edit description")
        .setValue("description")
        .setDescription("Edit the description of the embed")
        .setEmoji("📝"),
      new StringSelectMenuOptionBuilder() //
        .setLabel("Edit color")
        .setValue("color")
        .setDescription("Edit the color of the embed")
        .setEmoji("🎨"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Edit thumbnail")
        .setValue("thumbnail")
        .setDescription("Edit the thumbnail of the embed")
        .setEmoji("🖼️"),
      new StringSelectMenuOptionBuilder() //
        .setLabel("Edit image")
        .setValue("image")
        .setDescription("Edit the image of the embed")
        .setEmoji("🖼️"),
      new StringSelectMenuOptionBuilder() //
        .setLabel("Edit footer")
        .setValue("footer")
        .setDescription("Edit the footer of the embed")
        .setEmoji("👣")
    );

  const buttons = [
    new ButtonBuilder() //
      .setLabel("Finish")
      .setStyle(ButtonStyle.Success)
      .setCustomId(`SEND_MODAL_FINISH@${settings.id}`),
    new ButtonBuilder() //
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
      .setCustomId(`SEND_MODAL_CANCEL@${settings.id}`),
    new ButtonBuilder() //
      .setLabel("Preview embed")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`SEND_MODAL_PREVIEW@${settings.id}`),
  ];

  return {
    content: extraInfo + `Adjust your embed settings here:\n\u200b`,
    components: [
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
        channelSelectMenu
      ),
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        editEmbedSelectMenu
      ),
      new ActionRowBuilder<ButtonBuilder>().addComponents(buttons),
    ],
  };
}

export async function getSettings(id: UUID): Promise<SendModalSettings> {
  if (!id) {
    throw new Error("ID is required to get settings!");
  }

  const data = await Flashcore.get<SendModalSettings>(`__send-modal__@${id}`);

  logger.debug(`Loaded settings for ID ${id}:`, data ?? {});
  return data ?? {};
}

export async function updateSettings(
  id: UUID,
  settings: SendModalSettings
): Promise<SendModalSettings> {
  if (!id) {
    throw new Error("ID is required to update settings!");
  }

  const currentSettings = await getSettings(id);
  const newSettings = {
    ...currentSettings,
    ...settings,
  };

  await Flashcore.set<SendModalSettings>(
    `__send-modal__@${settings.id}`,
    newSettings
  );

  logger.debug(`Updated settings for ID ${id}:`, newSettings);

  return newSettings;
}
