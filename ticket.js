module.exports = {
  name: "ticket",
  description: "Create a support ticket",
  async execute(message) {
    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: 0, // text channel
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ["ViewChannel"],
        },
        {
          id: message.author.id,
          allow: ["ViewChannel", "SendMessages"],
        },
      ],
    });

    channel.send(`🎟️ Ticket opened by ${message.author}\nStaff will assist you soon.`);
    message.reply(`✅ Your ticket has been created: ${channel}`);
  },
};
