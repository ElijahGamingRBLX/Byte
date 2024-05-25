import type { MiddlewareData, MiddlewareResult } from "robo.js";
import { Collection, CommandInteraction, EmbedBuilder } from "discord.js";

const cooldownTime = 15_000;
const cooldown = new Collection();

export default async function (
  data: MiddlewareData
): Promise<MiddlewareResult> {
  const { type } = data.record;

  if (type === "event" || type === "api") {
    return { abort: false };
  }

  if (type === "command") {
    const payloadArray = data.payload;

    const interaction = payloadArray[0] as CommandInteraction;
    const commandName = interaction.commandName;
    const commandID = interaction.commandId;
    const userId = interaction.user.id;
    const cooldownKey = `${userId}-${commandID}`;

    if (cooldown.has(cooldownKey)) {
      const expirationTime = cooldown.get(cooldownKey) as number;
      const remainingTime = expirationTime - Date.now();

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`You are on cooldown!`)
        .setDescription(
          `You can use </${commandName}:${commandID}> again **<t:${Math.floor(
            expirationTime / 1000
          )}:R>**.`
        );

      if (remainingTime > 0) {
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return { abort: true };
      }
    }

    const newExpirationTime = Date.now() + cooldownTime;
    cooldown.set(cooldownKey, newExpirationTime);
    return { abort: false };
  }

  return { abort: false };
}
