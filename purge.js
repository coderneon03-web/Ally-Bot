import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages')
    .addIntegerOption(o => o.setName('amount').setDescription('Messages to delete (1-100)').setRequired(true)),

  async execute(ix) {
    if (!ix.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return ix.reply({ content: '❌ No permission.', ephemeral: true });

    const amount = ix.options.getInteger('amount');
    if (amount < 1 || amount > 100)
      return ix.reply({ content: '⚠️ Must be between 1-100.', ephemeral: true });

    const msgs = await ix.channel.bulkDelete(amount, true);
    ix.reply({ content: `🧹 Deleted ${msgs.size} messages.`, ephemeral: true });
  }
};
