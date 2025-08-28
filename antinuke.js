export function register(client) {
  const logChannelId = process.env.LOG_CHANNEL_ID;

  client.on('guildMemberRemove', async (member) => {
    // Anti mass-ban/kick (basic detection)
    const fetchedLogs = await member.guild.fetchAuditLogs({ type: 20, limit: 1 });
    const entry = fetchedLogs.entries.first();
    if (!entry) return;

    const executor = entry.executor;
    const logChannel = member.guild.channels.cache.get(logChannelId);

    logChannel?.send(`⚠️ AntiNuke: **${executor.tag}** banned/kicked **${member.user.tag}**`);

    // Auto-punish if not whitelisted
    if (!process.env.WHITELISTED_IDS?.split(',').includes(executor.id)) {
      try {
        const exMember = await member.guild.members.fetch(executor.id);
        await exMember.kick('Anti-nuke protection');
        logChannel?.send(`🚨 AntiNuke: **${executor.tag}** kicked for mass actions`);
      } catch (err) { /* ignore */ }
    }
  });
}
