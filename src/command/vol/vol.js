const { client } = require('../../core/main');

module.exports = {
    structure: {
        name: "vol",
        description: "Sets the playback volume (0-200)"
    },
    execute: async (message, args) => {
        if (!args[0] || isNaN(args[0]) || !Number.isInteger(Number(args[0]))) {
            return message.reply("Please provide a volume between 0 and 200. Usage: c!vol <0-200>");
        }

        const volume = Number(args[0]);
        if (volume < 0 || volume > 200) {
            return message.reply("Volume must be between 0 and 200.");
        }

        const player = client.shoukaku.players.get(message.guild.id);
        if (!player) {
            return message.reply("Nothing is playing right now.");
        }

        await player.setGlobalVolume(volume);
        return message.reply(`🔊 Volume set to **${volume}%**`);
    }
};
