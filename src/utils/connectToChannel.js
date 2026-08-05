const { client } = require("../core/main");
const { playTrack } = require("./playTrack");
const { nowPlayingEmbed, errorEmbed } = require("./embeds");

module.exports = {
    connectToChannel: async (voiceChannel) => {
        if (!voiceChannel) throw new Error("No voice channel provided");

        const guildId = voiceChannel.guild.id;

        if (!client.shoukaku) {
            throw new Error("Lavalink client is not initialized.");
        }

        const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);
        if (!node) {
            throw new Error("No available Lavalink node.");
        }

        const player = await client.shoukaku.joinVoiceChannel({
            guildId,
            channelId: voiceChannel.id,
            shardId: voiceChannel.guild.shardId || 0,
            deaf: true,
        });

        client.players.set(guildId, player);

        player.on("end", async (reason) => {
            if (reason?.reason === "replaced") return;

            const guildQueue = client.queue.get(guildId) || [];
            const textChannel = client.textChannels.get(guildId);
            const justPlayed = client.nowPlaying.get(guildId);
            const loopMode = client.loopMode.get(guildId) || "off";
            const naturalEnd = reason?.reason === "finished";

            if (loopMode === "track" && naturalEnd && justPlayed) {
                await playTrack(guildId, justPlayed.query, justPlayed.title, justPlayed.track);
                return;
            }

            if (loopMode === "queue" && naturalEnd && justPlayed) {
                guildQueue.push(justPlayed);
                client.queue.set(guildId, guildQueue);
            }

            if (guildQueue.length === 0) {
                try {
                    await client.shoukaku.leaveVoiceChannel(guildId);
                } catch (e) {
                    console.error("Error leaving voice channel:", e);
                }
                client.queue.delete(guildId);
                client.players.delete(guildId);
                client.textChannels.delete(guildId);
                client.nowPlaying.delete(guildId);
                client.loopMode.delete(guildId);
                return;
            }

            const next = guildQueue.shift();
            if (textChannel) {
                const embed = nowPlayingEmbed({
                    title: next.title || next.query,
                    url: next.track?.info?.uri,
                    duration: next.track?.info?.length,
                    thumbnail: next.track?.info?.artworkUrl
                });
                textChannel.send({ embeds: [embed] });
            }
            await playTrack(guildId, next.query, next.title, next.track);
        });

        player.on("exception", async (err) => {
            console.error("Lavalink player error:", err);
            const guildQueue = client.queue.get(guildId);
            const textChannel = client.textChannels.get(guildId);

            if (guildQueue && guildQueue.length > 0) {
                const next = guildQueue.shift();
                if (textChannel) {
                    textChannel.send({ embeds: [errorEmbed(`Skipping error track: **${next.title || next.query}**`)] });
                }
                await playTrack(guildId, next.query, next.title, next.track);
            } else {
                try {
                    await client.shoukaku.leaveVoiceChannel(guildId);
                } catch (e) {}
                client.queue.delete(guildId);
                client.players.delete(guildId);
                client.textChannels.delete(guildId);
                client.nowPlaying.delete(guildId);
                client.loopMode.delete(guildId);
            }
        });

        player.on("stuck", async () => {
            console.warn(`Lavalink player stuck on guild ${guildId}`);
            await player.stopTrack();
        });

        return player;
    }
};