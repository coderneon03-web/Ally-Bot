module.exports = {
  name: "ban",
  description: "Ban a user",
  async execute(message, args) {
    if (!message.member.permissions.has("BanMembers")) return message.reply("❌ No permission.");
    const user = message.mentions.users.first();
    if (!user) return message.reply("⚠️ Mention someone to ban.");

    const member = message.guild.members.cache.get(user.id);
    if (!member) return message.reply("❌ User not found in server.");

    await member.ban({ reason: "Banned by command" });
    message.channel.send(`🔨 ${user.tag} has been banned.`);
  },
};
