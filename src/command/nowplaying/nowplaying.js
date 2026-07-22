const { client } = require('../../core/main');
const { nowPlayingEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    structure: {
        name: "np",
        description: "Shows the currently playing track"
    },
    execute: async (message, args) => {
        const guildId = message.guild.id;
        const player = client.shoukaku.players.get(guildId);

        if (!player || !player.track) {
            return message.reply({ embeds: [errorEmbed("Nothing is currently playing.")] });
        }

        const info = player.track.info;
        const embed = nowPlayingEmbed({
            title: info?.title || 'Unknown Track',
            url: info?.uri,
            duration: info?.length,
            thumbnail: info?.artworkUrl
        });

        return message.channel.send({ embeds: [embed] });
    }
};
