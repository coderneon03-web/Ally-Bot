import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason')),

  async execute(ix) {
    if (!ix.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return ix.reply({ content: '❌ You lack permission.', ephemeral: true });

    const member = await ix.guild.members.fetch(ix.options.getUser('user', true).id);
    const reason = ix.options.getString('reason') || 'No reason';
    await member.kick(reason).catch(()=>{});
    ix.reply(`👢 Kicked **${member.user.tag}** | ${reason}`);
  }
};
