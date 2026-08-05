const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits } = require('discord.js');
const { startServer } = require('./keepAlive.js');
const { initLavalink } = require('./lavalink.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

module.exports = { client };

client.queue = new Map();
client.players = new Map();
client.textChannels = new Map();

client.commands = new Map();
const commandsDir = path.join(__dirname, "..", "command");
fs.readdirSync(commandsDir).forEach((commandFolder) => {
    const commandDir = path.join(commandsDir, commandFolder);
    const modules = fs
        .readdirSync(commandDir)
        .filter((file) => file.endsWith(".js"))
        .map((file) => require(path.join(commandDir, file)));
    client.commands.set(commandFolder, modules);
});

initLavalink(client);

const port = process.env.PORT || 3000;
const server = startServer(port);

let eventsDir = path.join(__dirname, "..", "event");
let eventList = fs.readdirSync(eventsDir);

eventList.forEach((event) => {
    let eventDir = path.join(eventsDir, event);
    let eventFiles = fs.readdirSync(eventDir);
    eventFiles.forEach(eventFile => {
        let eventFileDir = path.join(eventDir, eventFile);
        let eventModule = require(eventFileDir);

        if (eventModule.once) {
            client.once(event, eventModule.execute);
        } else {
            client.on(event, eventModule.execute);
        }
    });
});
