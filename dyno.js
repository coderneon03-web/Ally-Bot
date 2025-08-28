module.exports = {
  name: "warn",
  description: "Warn a user (like Dyno)",
  async execute(message, args) {
    if (!message.member.permissions.has("ManageMessages")) return message.reply("❌ No permission.");
    const user = message.mentions.users.first();
    if (!user) return message.reply("⚠️ Mention someone to warn.");

    message.channel.send(`⚠️ ${user.tag} has been warned by ${message.author.tag}`);
  },
};
