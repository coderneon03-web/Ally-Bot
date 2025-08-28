const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");

let distube; // shared instance across commands

// helper: make progress bar
function createProgressBar(current, total, size = 20) {
  const percentage = current / total;
  const progress = Math.round(size * percentage);
  const bar = "▬".repeat(progress) + "🔘" + "▬".repeat(size - progress);
  const elapsed = new Date(current).toISOString().substr(14, 5);
  const remaining = new Date(total - current).toISOString().substr(14, 5);
  return { bar, elapsed, remaining };
}

module.exports = {
  name: "music",
  description: "Music commands with DisTube",
  async execute(message, args, client) {
    if (!distube) {
      // init once per bot
      distube = new DisTube(client, {
        leaveOnStop: true,
        leaveOnEmpty: true,
        emitNewSongOnly: true,
        plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()],
      });

      distube
        .on("playSong", (queue, song) => {
          queue.textChannel?.send(
            `🎶 Now Playing: **${song.name}** \`[${song.formattedDuration}]\``
          );
        })
        .on("addSong", (queue, song) => {
          queue.textChannel?.send(`➕ Added: **${song.name}**`);
        })
        .on("error", (channel, e) => {
          channel?.send("❌ Error: " + e.toString().slice(0, 2000));
          console.error(e);
        });
    }

    const command = args.shift()?.toLowerCase();
    const voiceChannel = message.member.voice.channel;

    if (
      ["play", "skip", "stop", "queue", "loop", "volume", "shuffle", "autoplay", "filter", "nowplaying"].includes(
        command
      ) &&
      !voiceChannel
    ) {
      return message.reply("⚠️ You need to join a voice channel first!");
    }

    try {
      switch (command) {
        case "play":
          distube.play(voiceChannel, args.join(" "), {
            textChannel: message.channel,
            member: message.member,
          });
          break;

        case "skip":
          await distube.skip(message);
          message.channel.send("⏭️ Skipped the current song!");
          break;

        case "stop":
          distube.stop(message);
          message.channel.send("⏹️ Stopped the music & cleared queue.");
          break;

        case "queue":
          const queue = distube.getQueue(message);
          if (!queue) return message.channel.send("📭 Queue is empty.");
          message.channel.send(
            "🎶 Current Queue:\n" +
              queue.songs
                .map(
                  (song, i) =>
                    `${i === 0 ? "▶️" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``
                )
                .join("\n")
          );
          break;

        case "loop":
          const mode = distube.setRepeatMode(message);
          message.channel.send(
            `🔁 Loop mode: \`${
              mode ? (mode === 2 ? "Queue" : "Song") : "Off"
            }\``
          );
          break;

        case "volume":
          const volume = parseInt(args[0]);
          if (isNaN(volume))
            return message.channel.send("⚠️ Please provide a valid number!");
          distube.setVolume(message, volume);
          message.channel.send(`🔊 Volume set to ${volume}%`);
          break;

        case "shuffle":
          const q = distube.getQueue(message);
          if (!q) return message.channel.send("📭 No songs to shuffle.");
          q.shuffle();
          message.channel.send("🔀 Queue shuffled!");
          break;

        case "autoplay":
          const mode2 = distube.toggleAutoplay(message);
          message.channel.send(`📻 Autoplay: \`${mode2 ? "On" : "Off"}\``);
          break;

        case "filter":
          const filter = args[0];
          if (!filter)
            return message.channel.send("⚠️ Provide a filter (bassboost, nightcore, 3d, etc.)");
          const filters = distube.setFilter(message, filter);
          message.channel.send(`🎚️ Current Filters: \`${filters.join(", ") || "Off"}\``);
          break;

        case "nowplaying":
          const npQueue = distube.getQueue(message);
          if (!npQueue) return message.channel.send("📭 Nothing is playing.");
          const song = npQueue.songs[0];

          const { bar, elapsed, remaining } = createProgressBar(
            npQueue.currentTime * 1000,
            song.duration * 1000
          );

          const embed = new EmbedBuilder()
            .setColor(0x1db954)
            .setTitle("🎶 Now Playing")
            .setDescription(`**[${song.name}](${song.url})**`)
            .addFields(
              { name: "Duration", value: `\`${elapsed} ${bar} ${remaining}\`` },
              { name: "Requested by", value: `${song.user}`, inline: true }
            )
            .setThumbnail(song.thumbnail);

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("pause")
              .setLabel("⏯ Pause/Resume")
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId("skip")
              .setLabel("⏭ Skip")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("stop")
              .setLabel("⏹ Stop")
              .setStyle(ButtonStyle.Danger)
          );

          await message.channel.send({ embeds: [embed], components: [row] });
          break;

        default:
          message.reply("⚠️ Unknown music command!");
      }
    } catch (e) {
      message.channel.send("❌ Error: " + e.message);
    }

    // button handling
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;
      const queue = distube.getQueue(interaction.guildId);

      try {
        switch (interaction.customId) {
          case "pause":
            if (!queue)
              return interaction.reply({ content: "📭 Nothing playing.", ephemeral: true });
            if (queue.paused) {
              queue.resume();
              interaction.reply("▶️ Resumed!");
            } else {
              queue.pause();
              interaction.reply("⏸ Paused!");
            }
            break;
          case "skip":
            if (!queue)
              return interaction.reply({ content: "📭 Nothing to skip.", ephemeral: true });
            await queue.skip();
            interaction.reply("⏭️ Skipped!");
            break;
          case "stop":
            if (!queue)
              return interaction.reply({ content: "📭 Nothing to stop.", ephemeral: true });
            queue.stop();
            interaction.reply("⏹️ Stopped!");
            break;
        }
      } catch (e) {
        interaction.reply({ content: "❌ Error: " + e.message, ephemeral: true });
      }
    });
  },
};
