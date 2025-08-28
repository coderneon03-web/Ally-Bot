module.exports = {
  name: "apply",
  description: "Start an application form",
  async execute(message) {
    message.reply("📝 Check your DMs to apply!");

    try {
      const dm = await message.author.send("Welcome to the application form!\n\nQ1: Why do you want to apply?");
      const collector = dm.channel.createMessageCollector({ max: 3, time: 60000 });

      let step = 1;
      collector.on("collect", async (m) => {
        if (step === 1) {
          await dm.channel.send("Q2: What experience do you have?");
        }
        if (step === 2) {
          await dm.channel.send("Q3: How many hours can you be active?");
        }
        step++;
      });

      collector.on("end", () => {
        message.author.send("✅ Thanks for applying! Staff will review your answers.");
      });
    } catch (err) {
      message.reply("❌ I couldn't DM you. Please check your privacy settings.");
    }
  },
};
