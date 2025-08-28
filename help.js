
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands and features'),

  async execute(ix, client) {
    const embed = new EmbedBuilder()
      .setTitle(`🤖 ${client.user.tag} - Command List`)
      .setColor(0x5865F2)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('Here are all the available commands and features:')
      .addFields(
        {
          name: '🛠️ Moderation',
          value: '`/kick` - Kick a member\n`/ban` - Ban a member\n`/timeout` - Timeout a member\n`/purge` - Delete messages',
          inline: true
        },
        {
          name: '📊 Information',
          value: '`/dyno` - Bot & server stats\n`/serverinfo` - Server information\n`/userinfo` - User information\n`/avatar` - Display avatar',
          inline: true
        },
        {
          name: '🎫 Support System',
          value: '`/ticketpanel` - Create ticket panel\n`/applypanel` - Create application panel\n`/secretpanel` - Admin secret panel',
          inline: true
        },
        {
          name: '🔧 Utility',
          value: '`/ping` - Check bot latency\n`/invite` - Get bot invite link\n`/help` - Show this menu',
          inline: true
        },
        {
          name: '🛡️ Auto Features',
          value: '• Anti-Nuke Protection\n• Auto Role Assignment\n• Welcome Messages\n• Activity Logging',
          inline: true
        },
        {
          name: '⚙️ Setup Required',
          value: 'Configure environment variables in Secrets for full functionality. Check the dashboard for more info.',
          inline: true
        }
      )
      .setFooter({ 
        text: `${client.commands.size} commands loaded • Requested by ${ix.user.tag}`, 
        iconURL: ix.user.displayAvatarURL() 
      })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('🌐 Dashboard')
          .setURL('https://workspace.nodejs882.repl.co')
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setLabel('🔗 Invite Bot')
          .setURL(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID || '1409092717073404005'}&permissions=8&scope=bot%20applications.commands`)
          .setStyle(ButtonStyle.Link)
      );

    await ix.reply({ embeds: [embed], components: [row] });
  }
};
