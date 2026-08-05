const { client } = require('../../core/main.js');
const { EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds.js');

module.exports = {
    structure: {
        name: "pause",
        description: "Pauses the current track"
    },
    execute: async (message) => {
        const guildId = message.guild.id;
        const player = client.players.get(guildId);

        if (!player || !player.track) {
            return message.reply({ embeds: [errorEmbed('No song is currently playing.')] });
        }

        if (player.paused) {
            return message.reply({ embeds: [errorEmbed('The track is already paused.')] });
        }

        await player.setPaused(true);
        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription('⏸️ Paused.')
            .setFooter({ text: 'cores-beatzzz • Lavalink' });

        return message.channel.send({ embeds: [embed] });
    }
};
