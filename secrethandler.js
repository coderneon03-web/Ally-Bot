
export function register(client) {
  const secretChannelId = process.env.SECRET_CHANNEL_ID;
  const authorizedUsers = process.env.AUTHORIZED_USER_IDS?.split(',') || [];

  client.on('interactionCreate', async (ix) => {
    if (!ix.isButton()) return;

    if (ix.customId === 'secret_action') {
      // Check if user is authorized
      if (!authorizedUsers.includes(ix.user.id)) {
        return ix.reply({ 
          content: '🚫 You are not authorized to use this secret feature!', 
          ephemeral: true 
        });
      }

      // Secret action - could be anything you want
      const secretChannel = ix.guild.channels.cache.get(secretChannelId);
      
      if (secretChannel) {
        await secretChannel.send(`🔐 **Secret Action Triggered!**\nUser: ${ix.user.tag}\nTime: ${new Date().toLocaleString()}`);
      }

      await ix.reply({ 
        content: '✅ Secret action executed successfully! Check the secret channel.', 
        ephemeral: true 
      });
    }
  });
}
