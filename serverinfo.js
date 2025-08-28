
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display detailed server information'),

  async execute(ix) {
    const guild = ix.guild;
    const owner = await guild.fetchOwner();
    
    const embed = new EmbedBuilder()
      .setTitle(`📋 ${guild.name} Server Information`)
      .setColor(0x00AE86)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
      .addFields(
        {
          name: '👑 Server Owner',
          value: `${owner.user.tag} (${owner.user.id})`,
          inline: true
        },
        {
          name: '📅 Created On',
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          inline: true
        },
        {
          name: '🏷️ Server ID',
          value: guild.id,
          inline: true
        },
        {
          name: '👥 Members',
          value: `${guild.memberCount} total`,
          inline: true
        },
        {
          name: '📺 Channels',
          value: `${guild.channels.cache.size} total`,
          inline: true
        },
        {
          name: '🎭 Roles',
          value: `${guild.roles.cache.size} total`,
          inline: true
        },
        {
          name: '😀 Emojis',
          value: `${guild.emojis.cache.size}/50`,
          inline: true
        },
        {
          name: '🚀 Boost Status',
          value: `Level ${guild.premiumTier} (${guild.premiumSubscriptionCount} boosts)`,
          inline: true
        },
        {
          name: '🔐 Verification Level',
          value: `${guild.verificationLevel}`,
          inline: true
        }
      )
      .setFooter({ text: `Server created` })
      .setTimestamp(guild.createdTimestamp);

    if (guild.bannerURL()) {
      embed.setImage(guild.bannerURL({ dynamic: true, size: 512 }));
    }

    await ix.reply({ embeds: [embed] });
  }
};
