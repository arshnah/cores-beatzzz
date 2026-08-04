const { EmbedBuilder } = require('discord.js');
const { client } = require('../../core/main');
const { errorEmbed } = require('../../utils/embeds');

module.exports = {
    structure: {
        name: "remove",
        description: "Removes a track from the queue by position"
    },
    execute: async (message, args) => {
        const guildId = message.guild.id;
        const upcomingQueue = client.queue.get(guildId) || [];

        if (upcomingQueue.length === 0) {
            return message.reply({ embeds: [errorEmbed("The queue is empty.")] });
        }

        const positionStr = args[0];
        if (!positionStr || isNaN(positionStr) || !Number.isInteger(Number(positionStr))) {
            return message.reply({ embeds: [errorEmbed("Please provide a valid position number in the queue.")] });
        }

        const position = Number(positionStr);
        if (position < 1 || position > upcomingQueue.length) {
            return message.reply({ embeds: [errorEmbed(`Position must be between 1 and ${upcomingQueue.length}.`)] });
        }

        const [removedTrack] = upcomingQueue.splice(position - 1, 1);

        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription(`🗑️ Removed **${removedTrack.title || removedTrack.query}** from the queue.`)
            .setFooter({ text: 'cores-beatzzz • Lavalink' });

        return message.channel.send({ embeds: [embed] });
    }
};
