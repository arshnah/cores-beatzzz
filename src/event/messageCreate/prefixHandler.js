const config = require('../../config/config.json');
const prefix = config.bot.prefix;

module.exports = {
    execute: (message, client) => {
        if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
        let args = message.content.slice(prefix.length).split(" ");
        const command = args.shift();

        const commandModules = client.commands.get(command);
        if (!commandModules) return;

        commandModules.forEach((commandModule) => {
            try {
                commandModule.execute(message, args, client);
            } catch (error) {
                console.log(error)
                message.channel.send(`There was an error while executing that command: ${error}`);
            }
        });
    },
    once: false,
}