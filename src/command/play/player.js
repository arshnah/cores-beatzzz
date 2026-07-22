const { client } = require("../../core/main");
const { playTrack } = require("../../utils/playTrack");
const { connectToChannel } = require("../../utils/connectToChannel");

module.exports = {
    structure: {
        name: "play",
        description: "Joins your voice channel and starts playing music"
    },

    execute: async (message, args) => {
        const guildId = message.guild.id;
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply('You need to join a voice channel first!');
        }

        let player = client.players.get(guildId);
        if (player && player.connection.channelId !== voiceChannel.id) {
            return message.reply('I am already in another voice channel!');
        }

        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a YouTube link or search query.');
        }

        client.textChannels.set(guildId, message.channel);

        const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);
        if (!node) {
            return message.reply('No available Lavalink node connection.');
        }

        const search = query.startsWith('http') ? query : `ytsearch:${query}`;
        let res;
        try {
            res = await node.rest.resolve(search);
        } catch (error) {
            console.error('Error resolving track:', error);
            return message.reply('Error while resolving the requested track.');
        }

        if (!res || !res.data || (Array.isArray(res.data) && res.data.length === 0) || (res.loadType === 'empty') || (res.loadType === 'error')) {
            return message.reply('No results found for your query.');
        }

        let track;
        let title = query;

        if (res.loadType === 'track') {
            track = res.data;
            title = track.info?.title || title;
        } else if (res.loadType === 'search' || res.loadType === 'playlist') {
            const tracks = Array.isArray(res.data) ? res.data : res.data.tracks;
            if (!tracks || tracks.length === 0) {
                return message.reply('No results found for your query.');
            }
            track = tracks[0];
            title = track.info?.title || title;
        }

        if (!player || !player.track) {
            try {
                player = await connectToChannel(voiceChannel);
            } catch (err) {
                console.error('Failed to join voice channel:', err);
                return message.reply('Unable to join your voice channel.');
            }
            message.channel.send(`▶ Now playing: **${title}**`);
            await playTrack(guildId, query, title, track);
        } else {
            if (!client.queue.has(guildId)) client.queue.set(guildId, []);
            client.queue.get(guildId).push({ query, title, track });
            message.channel.send(`✅ Added to queue: **${title}**`);
        }

        return;
    }
};
