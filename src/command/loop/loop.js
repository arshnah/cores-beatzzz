const { client } = require('../../core/main.js');
const { EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds.js');

const MODES = ['off', 'track', 'queue'];
const LABELS = { off: 'Off', track: 'Track', queue: 'Queue' };

module.exports = {
    structure: {
        name: "loop",
        description: "Cycles loop mode (off/track/queue), or set one directly: c!loop track"
    },
    execute: async (message, args) => {
        const guildId = message.guild.id;
        const player = client.players.get(guildId);

        if (!player || !player.track) {
            return message.reply({ embeds: [errorEmbed('Nothing is playing right now.')] });
        }

        const requested = args[0]?.toLowerCase();
        let mode;

        if (requested) {
            if (!MODES.includes(requested)) {
                return message.reply({ embeds: [errorEmbed('Usage: `c!loop [off|track|queue]`')] });
            }
            mode = requested;
        } else {
            const current = client.loopMode.get(guildId) || 'off';
            mode = MODES[(MODES.indexOf(current) + 1) % MODES.length];
        }

        client.loopMode.set(guildId, mode);
        const embed = new EmbedBuilder()
            .setColor('#FF6B6B')
            .setDescription(`🔁 Loop mode: **${LABELS[mode]}**`)
            .setFooter({ text: 'cores-beatzzz • Lavalink' });

        return message.channel.send({ embeds: [embed] });
    }
};
