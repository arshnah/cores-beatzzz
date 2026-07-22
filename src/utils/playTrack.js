const { client } = require("../core/main");

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
            if (textChannel) textChannel.send(`⚠️ Failed to resolve audio for: **${title || query}**`);
            return;
        }

        const encodedTrack = typeof trackToPlay === 'string' ? trackToPlay : trackToPlay.encoded;
        await player.playTrack({ track: encodedTrack });
    }
};