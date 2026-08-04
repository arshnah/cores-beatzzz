const { client } = require('../../core/main.js');

module.exports = {
    structure: {
        name: "stop",
        description: "Stops playing current track and leave."
    },

    execute: async (message) => {
        const guildId = message.guild.id;
        const player = client.players.get(guildId);

        if (!player) {
            return message.reply('Nothing is playing right now.');
        }

        client.queue.delete(guildId);

        try {
            await player.stopTrack();
        } catch (e) {}

        try {
            await client.shoukaku.leaveVoiceChannel(guildId);
        } catch (e) {}

        client.players.delete(guildId);
        client.textChannels.delete(guildId);

        return message.channel.send('⏹️ Stopped playback and cleared the queue.');
    }
};