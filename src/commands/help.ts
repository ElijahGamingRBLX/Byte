import { getManifest } from "robo.js";
import { CommandEntry, type CommandConfig, type CommandResult } from "robo.js";
import { EmbedBuilder } from "discord.js";
import { getButtons } from "../core/utils.js";

export const config: CommandConfig = {
  description: "Shows the help menu.",
};

function getInnermostCommands(commands: Record<string, CommandEntry>, prefix = ""): { key: string; command: CommandEntry }[] {
  let innermostCommands: { key: string; command: CommandEntry }[] = [];
  const keys = Object.keys(commands);

  for (const key of keys) {
    if (commands[key].subcommands) {
      const subInnermostCommands = getInnermostCommands(
        //@ts-expect-error Fuck this.
        commands[key].subcommands,
        prefix ? `${prefix} ${key}` : key
      );
      innermostCommands = innermostCommands.concat(subInnermostCommands);
    } else {
      const commandPath = prefix ? `${prefix} ${key}` : key;
      innermostCommands.push({ key: commandPath, command: commands[key] });
    }
  }

  return innermostCommands;
}

export default (): CommandResult => {
  const manifest = getManifest();
  //@ts-expect-error Fuck this, too.
  const commands = getInnermostCommands(manifest?.commands);
  const maxCommandNameLength = Math.max(...commands.map(({ key }) => key.length));
  const formattedCommands = commands
    .map(({ key, command }) => {
      const padding = " ".repeat(maxCommandNameLength - key.length);
      return `${key}${padding} - ${command.description || "No description provided."}`;
    })
    .join("\n");

  return {
    embeds: [
      new EmbedBuilder()
        .setTitle("Byte's Help menu")
        .setColor("White")
        .setTimestamp()
        .setDescription(`Byte is a ROBLOX Key Bypasser Bot built with TypeScript, Discord.js, and Robo.js.`)
        .addFields({
          name: "Commands",
          value: `\`\`\`${formattedCommands.replaceAll("help menu", "this menu")}\`\`\``,
        }),
    ],
    components: getButtons().components,
  };
};
