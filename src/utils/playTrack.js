const { client } = require("../core/main");
const { errorEmbed } = require("./embeds");

module.exports = {
    playTrack: async (guildId, query, title, track) => {
        const player = client.players.get(guildId);
        if (!player) return;

        let trackToPlay = track;

        if (!trackToPlay) {
            const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);
            if (!node) {
                console.error("No available Lavalink node");
                return;
            }

            const search = query.startsWith('http') ? query : `ytsearch:${query}`;
            const res = await node.rest.resolve(search);

            if (res && res.data) {
                if (res.loadType === 'track') {
                    trackToPlay = res.data;
                } else if (res.loadType === 'search' || res.loadType === 'playlist') {
                    const tracks = Array.isArray(res.data) ? res.data : res.data.tracks;
                    if (tracks && tracks.length > 0) {
                        trackToPlay = tracks[0];
                    }
                }
            }
        }

        if (!trackToPlay) {
            console.error(`Could not resolve track for query: ${query}`);
            const textChannel = client.textChannels.get(guildId);
            if (textChannel) {
                textChannel.send({ embeds: [errorEmbed(`Failed to resolve audio for: **${title || query}**`)] });
            }
            return;
        }

        const encodedTrack = typeof trackToPlay === 'string' ? trackToPlay : trackToPlay.encoded;

        try {
            await player.playTrack({ track: { encoded: encodedTrack } });
            client.nowPlaying.set(guildId, { query, title, track: trackToPlay });
        } catch (error) {
            console.error("Error playing track via Lavalink:", error);
            const textChannel = client.textChannels.get(guildId);
            if (textChannel) {
                textChannel.send({ embeds: [errorEmbed(`Error starting playback for: **${title || query}**`)] });
            }
        }
    }
};