import { ButtonInteraction, EmbedBuilder, codeBlock } from "discord.js";
import { Flashcore, client } from "robo.js";
import { ResponseData, TryAgainData } from "../../types";
import { getButtons, getErrorEmbed } from "../../core/utils.js";
import { withCache } from "ultrafetch";
import { link } from "fs";

export default async (interaction: ButtonInteraction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("TRY_AGAIN@")) return;
  await interaction.deferUpdate();
  const id = interaction.customId.split("@")[1] as string;
  const data = await Flashcore.get<TryAgainData>(`__try-again_@${id}`);
  if (!data) return;
  if (interaction.user.id !== data.authorId) {
    return;
  }

  const m = await interaction.editReply({
    embeds: [new EmbedBuilder().setDescription("Loading...").setColor("Yellow").setTimestamp()],
    components: [],
  });
  const enhancedFetch = withCache(fetch);
  let responseData: ResponseData = {
    error: "An unknown error has occurred. Please try again later.",
  };
  try {
    const response = await enhancedFetch(`${process.env.API_URL}/bypass?url=${data.link}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    responseData = (await response.json()) as ResponseData;
  } catch (error) {
    await m.edit({
      ...(await getErrorEmbed("Could not connect to the API. Please try again later.", data.link, interaction.user.id)),
    });
  }
  if (data.link.includes("https://mobile.codex.lol")) {
    try {
      if (responseData.success) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Codex Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:codex:1225819184982654986> Codex Response",
                  value: `Key System completed!`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
        return;
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  } else if (data.link.includes("https://spdmteam.com/key-system-1?hwid=")) {
    try {
      if (responseData.success) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Arceus X Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setFooter({
                text: `HWID: ${new URL(data.link).searchParams.get("hwid")}`,
              })
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:arceus:1225781919225090080> Arceus X Response",
                  value: `Key System completed!`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
        return;
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  } else if (data.link.includes("https://gateway.platoboost.com/a/8?id=")) {
    try {
      if (responseData.key) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Delta Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setFooter({
                text: `User ID: ${new URL(data.link).searchParams.get("id")}`,
              })
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:delta:1225811720065515601> Delta Key",
                  value: `${codeBlock(responseData.key)}`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
        return;
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  } else if (data.link.includes("https://gateway.platoboost.com/a/2569?id=")) {
    try {
      if (responseData.key) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Hydrogen Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setFooter({
                text: `User ID: ${new URL(link).searchParams.get("id")}`,
              })
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:hydrogen:1225815421026832386> Hydrogen Key",
                  value: `${codeBlock(responseData.key)}`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
        return;
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  } else if (
    data.link.includes(
      "https://hohohubv-ac90f67762c4.herokuapp.com/api/getkeyv2?hwid=4d47175baf026dad997dac3f71ebbd6dd31eebd811e0b95b0714d1dde70592b5"
    )
  ) {
    try {
      if (responseData.key) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Hohohub Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setFooter({
                text: `HWID: ${new URL(data.link).searchParams.get("hwid")}`,
              })
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:hohohub:1225836662102429808> Hohohub Key",
                  value: `${codeBlock(responseData.key)}`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
        return;
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  } else if (data.link.includes("https://trigonevo.com/getkey/?hwid=")) {
    try {
      if (responseData.key) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Trigon Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setFooter({
                text: `HWID: ${new URL(data.link).searchParams.get("hwid")}`,
              })
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:trigon:1225827147399041025> Trigon Key",
                  value: `${codeBlock(responseData.key)}`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
        return;
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  } else if (data.link.includes("https://valyse.best/verification?device_id=")) {
    try {
      if (responseData.success) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Valyse Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setFooter({
                text: `Device ID: ${new URL(data.link).searchParams.get("device_id")}`,
              })
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:valyse:1225828915709350022> Valyse Response",
                  value: `Key System completed!`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
        return;
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  } else if (data.link.includes("https://pandadevelopment.net/getkey?service=vegax&hwid=")) {
    try {
      if (responseData.key) {
        await m.edit({
          embeds: [
            new EmbedBuilder()
              .setURL(data.link)
              .setTitle(`Vega X Bypasser${responseData.cached ? " (CACHED)" : ""}`)
              .setFooter({
                text: `HWID: ${new URL(link).searchParams.get("hwid")}`,
              })
              .setThumbnail(client.user?.avatar ? client.user.displayAvatarURL() : null)
              .setColor("White")
              .addFields(
                {
                  name: "<:vegax:1225824245276475443> Vega X Key",
                  value: `${codeBlock(responseData.key)}`,
                  inline: true,
                },
                {
                  name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                  value: `${responseData.took}`,
                  inline: true,
                }
              ),
          ],
          components: getButtons().components,
        });
      } else {
        return await m.edit({
          ...(await getErrorEmbed(responseData.error || undefined, data.link, interaction.user.id)),
        });
      }
    } catch (error) {
      return await m.edit({
        ...(await getErrorEmbed(error instanceof Error ? error.message : undefined, data.link, interaction.user.id)),
      });
    }
  }
};
