const { client } = require('../../core/main.js');
const { EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds.js');

module.exports = {
    structure: {
        name: "skip",
        description: "skips the current track"
    }, 
    execute: async (message, args) => {
        const guildId = message.guild.id;

        const player = client.players.get(guildId);
        if (!player || !player.track) {
            return message.reply({ embeds: [errorEmbed('No song is currently playing.')] });
        }

        await player.stopTrack();
        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription('⏭️ Skipped.')
            .setFooter({ text: 'cores-beatzzz • Lavalink' });

        message.channel.send({ embeds: [embed] });
        return;
    }
};