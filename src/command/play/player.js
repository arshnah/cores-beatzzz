const { client } = require("../../core/main");
const { playTrack } = require("../../utils/playTrack");
const { connectToChannel } = require("../../utils/connectToChannel");
const { nowPlayingEmbed, queuedEmbed, errorEmbed } = require("../../utils/embeds");

module.exports = {
    structure: {
        name: "play",
        description: "Joins your voice channel and starts playing music"
    },

    execute: async (message, args) => {
        const guildId = message.guild.id;
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply({ embeds: [errorEmbed('You need to join a voice channel first!')] });
        }

        let player = client.players.get(guildId);
        if (player && player.connection.channelId !== voiceChannel.id) {
            return message.reply({ embeds: [errorEmbed('I am already in another voice channel!')] });
        }

        const query = args.join(' ');
        if (!query) {
            return message.reply({ embeds: [errorEmbed('Please provide a YouTube link or search query.')] });
        }

        client.textChannels.set(guildId, message.channel);

        const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);
        if (!node) {
            return message.reply({ embeds: [errorEmbed('No available Lavalink node connection.')] });
        }

        const search = query.startsWith('http') ? query : `ytsearch:${query}`;
        let res;
        try {
            res = await node.rest.resolve(search);
        } catch (error) {
            console.error('Error resolving track:', error);
            return message.reply({ embeds: [errorEmbed('Error while resolving the requested track.')] });
        }

        if (!res || !res.data || (Array.isArray(res.data) && res.data.length === 0) || (res.loadType === 'empty') || (res.loadType === 'error')) {
            return message.reply({ embeds: [errorEmbed('No results found for your query.')] });
        }

        let track;
        let title = query;

        if (res.loadType === 'track') {
            track = res.data;
            title = track.info?.title || title;
        } else if (res.loadType === 'search' || res.loadType === 'playlist') {
            const tracks = Array.isArray(res.data) ? res.data : res.data.tracks;
            if (!tracks || tracks.length === 0) {
                return message.reply({ embeds: [errorEmbed('No results found for your query.')] });
            }
            track = tracks[0];
            title = track.info?.title || title;
        }

        if (!player || !player.track) {
            try {
                player = await connectToChannel(voiceChannel);
            } catch (err) {
                console.error('Failed to join voice channel:', err);
                return message.reply({ embeds: [errorEmbed('Unable to join your voice channel.')] });
            }
            const embed = nowPlayingEmbed({
                title,
                url: track?.info?.uri,
                duration: track?.info?.length,
                requester: message.author.tag,
                thumbnail: track?.info?.artworkUrl
            });
            message.channel.send({ embeds: [embed] });
            await playTrack(guildId, query, title, track);
        } else {
            if (!client.queue.has(guildId)) client.queue.set(guildId, []);
            client.queue.get(guildId).push({ query, title, track });
            const position = client.queue.get(guildId).length;
            const embed = queuedEmbed({ title, position });
            message.channel.send({ embeds: [embed] });
        }

        return;
    }
};
