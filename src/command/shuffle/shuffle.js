const { client } = require('../../core/main.js');
const { EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds.js');

module.exports = {
    structure: {
        name: "shuffle",
        description: "Shuffles the upcoming queue"
    },
    execute: async (message) => {
        const guildId = message.guild.id;
        const guildQueue = client.queue.get(guildId);

        if (!guildQueue || guildQueue.length < 2) {
            return message.reply({ embeds: [errorEmbed('Not enough tracks in the queue to shuffle.')] });
        }

        for (let i = guildQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [guildQueue[i], guildQueue[j]] = [guildQueue[j], guildQueue[i]];
        }

        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription(`🔀 Shuffled **${guildQueue.length}** tracks.`)
            .setFooter({ text: 'cores-beatzzz • Lavalink' });

        return message.channel.send({ embeds: [embed] });
    }
};
