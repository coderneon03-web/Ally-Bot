module.exports = {
  name: "avatar",
  description: "Get user avatar like Carl bot",
  async execute(message) {
    const user = message.mentions.users.first() || message.author;
    message.reply(user.displayAvatarURL({ size: 512, dynamic: true }));
  },
};
