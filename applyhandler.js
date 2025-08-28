import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export function register(client) {
  const appsChannelId = process.env.APPLICATIONS_CHANNEL;

  client.on('interactionCreate', async (ix) => {
    if (!ix.isButton()) return;

    if (ix.customId === 'start_apply') {
      const modal = new ModalBuilder()
        .setCustomId('apply_modal')
        .setTitle('Application Form');

      const q1 = new TextInputBuilder()
        .setCustomId('why')
        .setLabel('Why should we accept you?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const q2 = new TextInputBuilder()
        .setCustomId('exp')
        .setLabel('Any past experience?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(q1),
        new ActionRowBuilder().addComponents(q2)
      );

      await ix.showModal(modal);
    }

    if (ix.isModalSubmit() && ix.customId === 'apply_modal') {
      const why = ix.fields.getTextInputValue('why');
      const exp = ix.fields.getTextInputValue('exp');
      const channel = ix.guild.channels.cache.get(appsChannelId);

      channel?.send(`📋 New Application from **${ix.user.tag}**:\n**Why:** ${why}\n**Experience:** ${exp}`);
      await ix.reply({ content: '✅ Application submitted!', ephemeral: true });
    }
  });
}
