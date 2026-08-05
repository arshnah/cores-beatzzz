const { client } = require('../../core/main.js');
const { EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds.js');

const PRESETS = {
    bassboost: {
        equalizer: [
            { band: 0, gain: 0.6 },
            { band: 1, gain: 0.7 },
            { band: 2, gain: 0.8 },
            { band: 3, gain: 0.55 },
            { band: 4, gain: 0.25 }
        ]
    },
    nightcore: {
        timescale: { speed: 1.2, pitch: 1.2, rate: 1.0 }
    }
};

module.exports = {
    structure: {
        name: "filter",
        description: "Applies an audio filter: c!filter <bassboost|nightcore|off>"
    },
    execute: async (message, args) => {
        const guildId = message.guild.id;
        const player = client.players.get(guildId);

        if (!player || !player.track) {
            return message.reply({ embeds: [errorEmbed('Nothing is playing right now.')] });
        }

        const choice = args[0]?.toLowerCase();
        if (!choice || !['bassboost', 'nightcore', 'off'].includes(choice)) {
            return message.reply({ embeds: [errorEmbed('Usage: `c!filter <bassboost|nightcore|off>`')] });
        }

        if (choice === 'off') {
            await player.clearFilters();
            const embed = new EmbedBuilder()
                .setColor('#FF6B6B')
                .setDescription('🎚️ Filters cleared.')
                .setFooter({ text: 'cores-beatzzz • Lavalink' });
            return message.channel.send({ embeds: [embed] });
        }

        await player.setFilters(PRESETS[choice]);
        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription(`🎚️ Filter applied: **${choice}**`)
            .setFooter({ text: 'cores-beatzzz • Lavalink' });

        return message.channel.send({ embeds: [embed] });
    }
};
