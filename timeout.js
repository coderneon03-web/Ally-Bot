import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Minutes').setRequired(true)),

  async execute(ix) {
    if (!ix.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return ix.reply({ content: '❌ No permission.', ephemeral: true });

    const member = await ix.guild.members.fetch(ix.options.getUser('user', true).id);
    const minutes = ix.options.getInteger('minutes');
    await member.timeout(minutes * 60 * 1000, 'Timeout command').catch(()=>{});
    ix.reply(`⏳ Timed out **${member.user.tag}** for ${minutes} minutes`);
  }
};
