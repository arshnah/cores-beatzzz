const { client } = require("../core/main");
const { playTrack } = require("./playTrack");

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
            if (reason?.type === "replaced") return;

            const guildQueue = client.queue.get(guildId);
            const textChannel = client.textChannels.get(guildId);

            if (!guildQueue || guildQueue.length === 0) {
                try {
                    await client.shoukaku.leaveVoiceChannel(guildId);
                } catch (e) {
                    console.error("Error leaving voice channel:", e);
                }
                client.queue.delete(guildId);
                client.players.delete(guildId);
                client.textChannels.delete(guildId);
                return;
            }

            const next = guildQueue.shift();
            if (textChannel) textChannel.send(`▶ Now playing: **${next.title || next.query}**`);
            await playTrack(guildId, next.query, next.title, next.track);
        });

        player.on("exception", async (err) => {
            console.error("Lavalink player error:", err);
            const guildQueue = client.queue.get(guildId);
            const textChannel = client.textChannels.get(guildId);

            if (guildQueue && guildQueue.length > 0) {
                const next = guildQueue.shift();
                if (textChannel) textChannel.send(`⚠️ Skipping error track: **${next.title || next.query}**`);
                await playTrack(guildId, next.query, next.title, next.track);
            } else {
                try {
                    await client.shoukaku.leaveVoiceChannel(guildId);
                } catch (e) {}
                client.queue.delete(guildId);
                client.players.delete(guildId);
                client.textChannels.delete(guildId);
            }
        });

        player.on("stuck", async () => {
            console.warn(`Lavalink player stuck on guild ${guildId}`);
            await player.stopTrack();
        });

        return player;
    }
};