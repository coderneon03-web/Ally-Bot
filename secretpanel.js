
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('secretpanel')
    .setDescription('Send the secret panel (admin only)'),

  async execute(ix) {
    if (!ix.member.permissions.has('Administrator'))
      return ix.reply({ content: '❌ Admin only.', ephemeral: true });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('secret_action')
        .setLabel('🔒 Secret Action')
        .setStyle(ButtonStyle.Danger)
    );

    await ix.reply({ 
      content: '🤫 **Secret Panel** - Only authorized users can use this!', 
      components: [row],
      ephemeral: true 
    });
  }
};
