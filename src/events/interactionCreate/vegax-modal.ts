import { EmbedBuilder, ModalSubmitInteraction, codeBlock } from "discord.js";
import { withCache } from "ultrafetch";
import {
  getButtons,
  getInvalidUrlEmbed,
  getErrorEmbed,
} from "../../core/utils.js";
import { ResponseData } from "../../types";
import { client } from "robo.js";
export default async (interaction: ModalSubmitInteraction) => {
  if (!interaction.isModalSubmit()) return;
  if (!interaction.customId.startsWith("VEGAX_MODAL")) return;
  const ephemeral = interaction.customId.split("@")[1] === "EPHEMERAL";
  const link = interaction.fields.getTextInputValue("VEGAX_LINK");
  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription("Loading...")
        .setColor("Yellow")
        .setTimestamp(),
    ],
    ephemeral,
    fetchReply: true,
  });

  try {
    if (
      !/^https:\/\/pandadevelopment\.net\/getkey\?service=vegax&hwid=[^&]{2,}(&provider=linkvertise)?$/.test(
        link
      )
    ) {
      const invalidLinkEmbed = getInvalidUrlEmbed(link, "Vega X");

      await interaction.editReply({
        ...invalidLinkEmbed,
      });
      return;
    }

    const enhancedFetch = withCache(fetch);

    const response = await enhancedFetch(
      `${process.env.API_URL}/bypass?url=${link}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const data = (await response.json()) as ResponseData;

    if (data.key) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setURL(link)
            .setTitle(`Vega X Bypasser${data.cached ? " (CACHED)" : ""}`)
            .setFooter({
              text: `HWID: ${new URL(link).searchParams.get("hwid")}`,
            })
            .setThumbnail(
              client.user?.avatar ? client.user.displayAvatarURL() : null
            )
            .setColor("White")
            .addFields(
              {
                name: "<:vegax:1225824245276475443> Vega X Key",
                value: `${codeBlock(data.key)}`,
                inline: true,
              },
              {
                name: "<:iOS_stopwatch:1225797873652994219> Response Time",
                value: `${data.took}`,
                inline: true,
              }
            ),
        ],
        components: getButtons().components,
      });
      return;
    } else {
      if (!ephemeral) {
        return await interaction.editReply({
          ...(await getErrorEmbed(
            data.error || undefined,
            link,
            interaction.user.id
          )),
        });
      } else {
        return await interaction.editReply({
          ...(await getErrorEmbed(data.error || undefined)),
        });
      }
    }
  } catch (error) {
    if (!ephemeral) {
      return await interaction.editReply({
        ...(await getErrorEmbed(
          error instanceof Error ? error.message : undefined,
          link,
          interaction.user.id
        )),
      });
    } else {
      return await interaction.editReply({
        ...(await getErrorEmbed(
          error instanceof Error ? error.message : undefined
        )),
      });
    }
  }
};
