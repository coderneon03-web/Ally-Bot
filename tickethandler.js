export function register(client) {
  const ticketsCategoryId = process.env.TICKETS_CATEGORY;

  client.on('interactionCreate', async (ix) => {
    if (!ix.isButton()) return;

    if (ix.customId === 'open_ticket') {
      const channel = await ix.guild.channels.create({
        name: `ticket-${ix.user.username}`,
        parent: ticketsCategoryId,
        permissionOverwrites: [
          { id: ix.guild.id, deny: ['ViewChannel'] },
          { id: ix.user.id, allow: ['ViewChannel', 'SendMessages'] },
        ]
      });

      await channel.send(`🎫 Ticket opened by ${ix.user}. Support will be with you shortly.`);
      await ix.reply({ content: `✅ Your ticket has been opened: ${channel}`, ephemeral: true });
    }
  });
}
