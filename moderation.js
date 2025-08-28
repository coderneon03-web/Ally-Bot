
import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Advanced moderation commands')
    .addSubcommand(sub => sub
      .setName('warn')
      .setDescription('Warn a user')
      .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Warning reason').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('warnings')
      .setDescription('View user warnings')
      .addUserOption(o => o.setName('user').setDescription('User to check').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('clearwarns')
      .setDescription('Clear user warnings')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)))
    .addSubcommand(sub => sub
      .setName('lock')
      .setDescription('Lock a channel')
      .addChannelOption(o => o.setName('channel').setDescription('Channel to lock')))
    .addSubcommand(sub => sub
      .setName('unlock')
      .setDescription('Unlock a channel')
      .addChannelOption(o => o.setName('channel').setDescription('Channel to unlock')))
    .addSubcommand(sub => sub
      .setName('slowmode')
      .setDescription('Set channel slowmode')
      .addIntegerOption(o => o.setName('seconds').setDescription('Seconds (0-21600)').setRequired(true))
      .addChannelOption(o => o.setName('channel').setDescription('Channel')))
    .addSubcommand(sub => sub
      .setName('nuke')
      .setDescription('Clone and delete channel'))
    .addSubcommand(sub => sub
      .setName('massban')
      .setDescription('Ban multiple users')
      .addStringOption(o => o.setName('userids').setDescription('User IDs (comma separated)').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Ban reason'))),

  async execute(ix) {
    if (!ix.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return ix.reply({ content: '❌ You need moderation permissions.', ephemeral: true });

    const subcommand = ix.options.getSubcommand();
    const logChannelId = process.env.LOG_CHANNEL_ID;
    const logChannel = ix.guild.channels.cache.get(logChannelId);

    switch (subcommand) {
      case 'warn': {
        const user = ix.options.getUser('user');
        const reason = ix.options.getString('reason');
        
        // In a real bot, you'd store warnings in a database
        const embed = new EmbedBuilder()
          .setTitle('⚠️ User Warned')
          .addFields(
            { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
            { name: 'Moderator', value: ix.user.tag, inline: true },
            { name: 'Reason', value: reason, inline: false }
          )
          .setColor(0xffaa00)
          .setTimestamp();
        
        await ix.reply({ embeds: [embed] });
        logChannel?.send({ embeds: [embed] });
        
        // Try to DM the user
        try {
          await user.send(`⚠️ You have been warned in **${ix.guild.name}**\n**Reason:** ${reason}\n**Moderator:** ${ix.user.tag}`);
        } catch (e) { /* User has DMs disabled */ }
        break;
      }
      
      case 'warnings': {
        const user = ix.options.getUser('user');
        
        // Simulate warnings data (replace with database query)
        const warnings = [
          { id: 1, reason: 'Spamming', moderator: 'Admin#1234', date: '2024-01-15' },
          { id: 2, reason: 'Inappropriate language', moderator: 'Mod#5678', date: '2024-01-20' }
        ];
        
        const embed = new EmbedBuilder()
          .setTitle(`⚠️ Warnings for ${user.tag}`)
          .setDescription(warnings.length ? 
            warnings.map(w => `**${w.id}.** ${w.reason} - ${w.moderator} (${w.date})`).join('\n') : 
            'No warnings found.')
          .setColor(0xffaa00)
          .setThumbnail(user.displayAvatarURL());
        
        await ix.reply({ embeds: [embed] });
        break;
      }
      
      case 'clearwarns': {
        const user = ix.options.getUser('user');
        
        // In a real bot, you'd clear warnings from database
        const embed = new EmbedBuilder()
          .setTitle('✅ Warnings Cleared')
          .setDescription(`Cleared all warnings for ${user.tag}`)
          .setColor(0x00ff00);
        
        await ix.reply({ embeds: [embed] });
        logChannel?.send(`🧹 ${ix.user.tag} cleared warnings for ${user.tag}`);
        break;
      }
      
      case 'lock': {
        const channel = ix.options.getChannel('channel') || ix.channel;
        
        await channel.permissionOverwrites.edit(ix.guild.id, {
          SendMessages: false
        });
        
        await ix.reply(`🔒 Locked ${channel}`);
        await channel.send('🔒 This channel has been locked by a moderator.');
        break;
      }
      
      case 'unlock': {
        const channel = ix.options.getChannel('channel') || ix.channel;
        
        await channel.permissionOverwrites.edit(ix.guild.id, {
          SendMessages: null
        });
        
        await ix.reply(`🔓 Unlocked ${channel}`);
        await channel.send('🔓 This channel has been unlocked.');
        break;
      }
      
      case 'slowmode': {
        const seconds = ix.options.getInteger('seconds');
        const channel = ix.options.getChannel('channel') || ix.channel;
        
        if (seconds < 0 || seconds > 21600)
          return ix.reply({ content: '❌ Slowmode must be between 0-21600 seconds!', ephemeral: true });
        
        await channel.setRateLimitPerUser(seconds);
        
        if (seconds === 0) {
          await ix.reply(`⚡ Disabled slowmode in ${channel}`);
        } else {
          await ix.reply(`🐌 Set slowmode to ${seconds} seconds in ${channel}`);
        }
        break;
      }
      
      case 'nuke': {
        if (!ix.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
          return ix.reply({ content: '❌ You need Manage Channels permission.', ephemeral: true });
        
        const channel = ix.channel;
        const channelData = {
          name: channel.name,
          topic: channel.topic,
          position: channel.position,
          parent: channel.parent,
          permissionOverwrites: channel.permissionOverwrites.cache
        };
        
        await ix.reply('💣 Nuking channel in 3 seconds...');
        
        setTimeout(async () => {
          const newChannel = await channel.clone(channelData);
          await channel.delete();
          await newChannel.send('💥 Channel has been nuked and recreated!');
        }, 3000);
        break;
      }
      
      case 'massban': {
        if (!ix.member.permissions.has(PermissionsBitField.Flags.BanMembers))
          return ix.reply({ content: '❌ You need Ban Members permission.', ephemeral: true });
        
        const userIds = ix.options.getString('userids').split(',').map(id => id.trim());
        const reason = ix.options.getString('reason') || 'Mass ban';
        
        await ix.deferReply();
        
        let banned = 0;
        let failed = 0;
        
        for (const userId of userIds) {
          try {
            await ix.guild.members.ban(userId, { reason });
            banned++;
          } catch (e) {
            failed++;
          }
        }
        
        const embed = new EmbedBuilder()
          .setTitle('🔨 Mass Ban Results')
          .addFields(
            { name: '✅ Successfully Banned', value: banned.toString(), inline: true },
            { name: '❌ Failed', value: failed.toString(), inline: true },
            { name: '📝 Reason', value: reason, inline: false }
          )
          .setColor(banned > 0 ? 0xff0000 : 0xffaa00);
        
        await ix.editReply({ embeds: [embed] });
        break;
      }
    }
  }
};
