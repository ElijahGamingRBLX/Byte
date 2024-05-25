import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionEditReplyOptions } from "discord.js";
import { randomUUID } from "node:crypto";
import { Flashcore } from "robo.js";
import { TryAgainData } from "../types";

export function getButtons() {
  const inviteButton = new ButtonBuilder()
    .setLabel("Invite Me")
    .setStyle(ButtonStyle.Link)
    .setURL("https://discord.com/oauth2/authorize?client_id=1199315287342850088&permissions=8&scope=bot+applications.commands");

  const supportServerButton = new ButtonBuilder() //
    .setLabel("Support Server")
    .setStyle(ButtonStyle.Link)
    .setURL("https://discord.gg/fVzVCpMqHF");

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(inviteButton, supportServerButton);

  return {
    components: [row],
  };
}

export function getInvalidUrlEmbed(link: string, executor: string): InteractionEditReplyOptions {
  const embed = new EmbedBuilder()
    .setTitle("Invalid URL!")
    .setDescription(`The provided URL \`(${link})\` is not a valid ${executor} URL.`)
    .setColor("Red")
    .setTimestamp();

  return {
    embeds: [embed],
    components: getButtons().components,
  };
}

export async function getErrorEmbed(error?: string, link?: string, authorId?: string): Promise<InteractionEditReplyOptions> {
  const embed = new EmbedBuilder()
    .setTitle("An error occurred!")
    .setDescription(error ?? "An unknown error occurred please report this to the developers.")
    .setColor("Red")
    .setTimestamp();

  if (!link) {
    return {
      embeds: [embed],
      components: getButtons().components,
    };
  } else {
    const id = randomUUID();
    await Flashcore.set<TryAgainData>(`__try-again_@${id}`, { id, link, authorId: authorId! });
    const tryAgainButton = new ButtonBuilder().setLabel("Try Again").setStyle(ButtonStyle.Primary).setCustomId(`TRY_AGAIN@${id}`);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(tryAgainButton, getButtons().components[0].components[0], getButtons().components[0].components[1]);

    return {
      embeds: [embed],
      components: [row],
    };
  }
}
