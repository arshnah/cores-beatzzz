const { client } = require('../../core/main');
const { queueListEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    structure: {
        name: "queue",
        description: "Shows the current music queue"
    },
    execute: async (message, args) => {
        const guildId = message.guild.id;
        const upcomingQueue = client.queue.get(guildId) || [];
        const player = client.shoukaku.players.get(guildId);
        const currentTitle = player?.track?.info?.title;

        if (upcomingQueue.length === 0 && (!player || !player.track)) {
            return message.reply({ embeds: [errorEmbed("Nothing is playing or queued.")] });
        }

        let page = parseInt(args[0], 10);
        if (isNaN(page) || page < 1) {
            page = 1;
        }

        const totalPages = Math.max(1, Math.ceil(upcomingQueue.length / 10));
        if (page > totalPages) {
            page = totalPages;
        }

        const startIndex = (page - 1) * 10;
        const pageTracks = upcomingQueue.slice(startIndex, startIndex + 10);

        const embed = queueListEmbed({
            tracks: pageTracks,
            currentTitle,
            page,
            totalPages,
            totalTracks: upcomingQueue.length,
            startIndex
        });

        return message.channel.send({ embeds: [embed] });
    }
};
