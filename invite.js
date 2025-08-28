
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the bot invite link'),

  async execute(ix, client) {
    const clientId = process.env.CLIENT_ID || '1409092717073404005';
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;
    
    const embed = new EmbedBuilder()
      .setTitle('🤖 Invite Ally-Bot to Your Server!')
      .setColor(0x5865F2)
      .setDescription(`Click the link below to add **${client.user.tag}** to your server!`)
      .addFields(
        {
          name: '🔗 Invite Link',
          value: `[Click here to invite!](${inviteUrl})`,
          inline: false
        },
        {
          name: '✨ Features',
          value: '• Moderation Commands\n• Ticket System\n• Anti-Nuke Protection\n• Auto Role\n• Welcome Messages\n• Application System\n• Server Statistics',
          inline: false
        }
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: `Requested by ${ix.user.tag}`, iconURL: ix.user.displayAvatarURL() })
      .setTimestamp();

    await ix.reply({ embeds: [embed] });
  }
};
