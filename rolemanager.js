
import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Role management commands')
    .addSubcommand(sub => sub
      .setName('add')
      .setDescription('Add a role to a user')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('remove')
      .setDescription('Remove a role from a user')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('create')
      .setDescription('Create a new role')
      .addStringOption(o => o.setName('name').setDescription('Role name').setRequired(true))
      .addStringOption(o => o.setName('color').setDescription('Hex color (e.g., #ff0000)'))
      .addBooleanOption(o => o.setName('hoist').setDescription('Display separately')))
    .addSubcommand(sub => sub
      .setName('delete')
      .setDescription('Delete a role')
      .addRoleOption(o => o.setName('role').setDescription('Role to delete').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('list')
      .setDescription('List all server roles')),

  async execute(ix) {
    if (!ix.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
      return ix.reply({ content: '❌ You need Manage Roles permission.', ephemeral: true });

    const subcommand = ix.options.getSubcommand();

    switch (subcommand) {
      case 'add': {
        const user = ix.options.getUser('user');
        const role = ix.options.getRole('role');
        const member = await ix.guild.members.fetch(user.id);
        
        if (member.roles.cache.has(role.id))
          return ix.reply({ content: `❌ ${user.tag} already has the ${role.name} role.`, ephemeral: true });
        
        await member.roles.add(role);
        ix.reply(`✅ Added **${role.name}** role to **${user.tag}**`);
        break;
      }
      
      case 'remove': {
        const user = ix.options.getUser('user');
        const role = ix.options.getRole('role');
        const member = await ix.guild.members.fetch(user.id);
        
        if (!member.roles.cache.has(role.id))
          return ix.reply({ content: `❌ ${user.tag} doesn't have the ${role.name} role.`, ephemeral: true });
        
        await member.roles.remove(role);
        ix.reply(`✅ Removed **${role.name}** role from **${user.tag}**`);
        break;
      }
      
      case 'create': {
        const name = ix.options.getString('name');
        const color = ix.options.getString('color') || '#000000';
        const hoist = ix.options.getBoolean('hoist') || false;
        
        const role = await ix.guild.roles.create({
          name,
          color,
          hoist,
          reason: `Role created by ${ix.user.tag}`
        });
        
        ix.reply(`✅ Created role **${role.name}** with color ${color}`);
        break;
      }
      
      case 'delete': {
        const role = ix.options.getRole('role');
        const roleName = role.name;
        
        await role.delete(`Role deleted by ${ix.user.tag}`);
        ix.reply(`✅ Deleted role **${roleName}**`);
        break;
      }
      
      case 'list': {
        const roles = ix.guild.roles.cache
          .filter(role => role.name !== '@everyone')
          .sort((a, b) => b.position - a.position)
          .map(role => `${role} - ${role.members.size} members`)
          .slice(0, 20);
        
        const embed = new EmbedBuilder()
          .setTitle(`📋 Server Roles (${ix.guild.roles.cache.size - 1})`)
          .setDescription(roles.join('\n') || 'No roles found')
          .setColor(0x5865F2)
          .setFooter({ text: `Showing top 20 roles` });
        
        ix.reply({ embeds: [embed] });
        break;
      }
    }
  }
};
