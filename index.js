// ===== Modules =====
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config(); // Load token from .env

// ===== Express Server for Keep-Alive =====
const app = express();
app.use(express.static("."));

// Root route
app.get("/", (req, res) => res.send("Bot is running!"));

// /ping route for keepalive.js
app.get("/ping", (req, res) => res.send("Pong! Server alive 🚀"));

// Listen on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`🌍 Uptime server running on port ${PORT}`));

// ===== Discord Bot Setup =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection();
const prefix = "!";

// ===== Command Handler =====
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name) client.commands.set(command.name, command);
}

// ===== Message Event =====
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (command) {
    try {
      await command.execute(message, args, client);
    } catch (err) {
      console.error(err);
      message.reply("⚠️ Error executing this command.");
    }
  }
});

// ===== Anti-Nuke System =====
client.on("guildMemberRemove", (member) => {
  console.log(`[AntiNuke] ${member.user.tag} left or was kicked/banned`);
});

client.on("channelDelete", (channel) => {
  console.log(`[AntiNuke] Channel deleted: ${channel.name}`);
});

// ===== Ready Event =====
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== Debug token loading =====
console.log("Token exists:", !!process.env.TOKEN);
console.log("Token length:", process.env.TOKEN ? process.env.TOKEN.length : 0);

// ===== Login =====
client.login(process.env.TOKEN);