const { EmbedBuilder } = require('discord.js');
const { client } = require('../../core/main');
const { errorEmbed } = require('../../utils/embeds');

module.exports = {
    structure: {
        name: "move",
        description: "Moves a track to a different position in the queue"
    },
    execute: async (message, args) => {
        const guildId = message.guild.id;
        const upcomingQueue = client.queue.get(guildId) || [];

        if (upcomingQueue.length === 0) {
            return message.reply({ embeds: [errorEmbed("The queue is empty.")] });
        }

        const fromStr = args[0];
        const toStr = args[1];

        if (!fromStr || !toStr || isNaN(fromStr) || isNaN(toStr) || !Number.isInteger(Number(fromStr)) || !Number.isInteger(Number(toStr))) {
            return message.reply({ embeds: [errorEmbed("Please provide valid 'from' and 'to' position numbers.")] });
        }

        const from = Number(fromStr);
        const to = Number(toStr);

        if (from < 1 || from > upcomingQueue.length) {
            return message.reply({ embeds: [errorEmbed(`The 'from' position must be between 1 and ${upcomingQueue.length}.`)] });
        }

        if (to < 1 || to > upcomingQueue.length) {
            return message.reply({ embeds: [errorEmbed(`The 'to' position must be between 1 and ${upcomingQueue.length}.`)] });
        }

        if (from === to) {
            const track = upcomingQueue[from - 1];
            const embed = new EmbedBuilder()
                .setColor('#FF6B6B')
                .setDescription(`↔️ Moved **${track.title || track.query}** to position **${to}**.`)
                .setFooter({ text: 'cores-beatzzz • Lavalink' });
            return message.channel.send({ embeds: [embed] });
        }

        const [movedTrack] = upcomingQueue.splice(from - 1, 1);
        upcomingQueue.splice(to - 1, 0, movedTrack);

        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription(`↔️ Moved **${movedTrack.title || movedTrack.query}** from position **${from}** to **${to}**.`)
            .setFooter({ text: 'cores-beatzzz • Lavalink' });

        return message.channel.send({ embeds: [embed] });
    }
};
