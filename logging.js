export function register(client) {
  const logChannelId = process.env.LOG_CHANNEL_ID;

  client.on('messageDelete', (msg) => {
    const log = msg.guild.channels.cache.get(logChannelId);
    log?.send(`🗑️ Message deleted in ${msg.channel} by ${msg.author?.tag || 'Unknown'}`);
  });

  client.on('channelCreate', (ch) => {
    const log = ch.guild.channels.cache.get(logChannelId);
    log?.send(`📂 Channel created: ${ch.name}`);
  });

  client.on('guildBanAdd', (ban) => {
    const log = ban.guild.channels.cache.get(logChannelId);
    log?.send(`🔨 User banned: ${ban.user.tag}`);
  });
}
