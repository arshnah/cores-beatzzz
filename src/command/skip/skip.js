const { client } = require('../../core/main.js');

module.exports = {
    structure: {
        name: "skip",
        description: "skips the current track"
    }, 
    execute: async (message, args) => {
        const guildId = message.guild.id;

        const player = client.players.get(guildId);
        if (!player || !player.track) {
            return message.reply('No song is currently playing.');
        }

        await player.stopTrack();
        message.channel.send('⏭️ Skipped the current song.');
        return;
    }
};