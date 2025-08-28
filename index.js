// ===== Modules =====
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config(); // Load .env

// ===== Validate Token =====
if (!process.env.TOKEN) {
  console.error("❌ ERROR: No TOKEN found in .env file.");
  process.exit(1);
}
if (!process.env.TOKEN.startsWith("M")) {
  console.error("❌ ERROR: Invalid-looking TOKEN. Did you paste Client ID instead of Bot Token?");
  console.error("Your TOKEN is:", process.env.TOKEN);
  process.exit(1);
}

// ===== Express Server for Keep-Alive =====
const app = express();
app.use(express.static("."));

app.get("/", (req, res) => res.send("🚀 Bot is running!"));
app.get("/ping", (req, res) => res.send("Pong! Server alive 🚀"));

const PORT = process.env.PORT || 5000;
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
const commandsPath = path.join(__dirname, "commands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name) client.commands.set(command.name, command);
  }
}

// ===== Events =====
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

// Anti-Nuke Logs
client.on("guildMemberRemove", (member) => {
  console.log(`[AntiNuke] ${member.user.tag} left or was kicked/banned`);
});

client.on("channelDelete", (channel) => {
  console.log(`[AntiNuke] Channel deleted: ${channel.name}`);
});

// Ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== Login =====
console.log("✅ Token loaded. Length:", process.env.TOKEN.length);
client.login(process.env.TOKEN);
