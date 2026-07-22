const { Shoukaku, Connectors } = require('shoukaku');

const Nodes = [
    {
        name: 'default',
        url: `${process.env.LAVALINK_HOST || 'localhost'}:${process.env.LAVALINK_PORT || 2333}`,
        auth: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
        secure: process.env.LAVALINK_SECURE === 'true'
    }
];

function initLavalink(client) {
    const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes, {
        moveOnDisconnect: true,
        resume: true,
        reconnectTries: 5
    });

    shoukaku.on('error', (name, error) => {
        console.error(`[Lavalink] Node ${name} error:`, error);
    });

    shoukaku.on('ready', (name) => {
        console.log(`[Lavalink] Node ${name} is ready.`);
    });

    shoukaku.on('disconnect', (name, count) => {
        console.warn(`[Lavalink] Node ${name} disconnected (${count}).`);
    });

    client.shoukaku = shoukaku;
    return shoukaku;
}

module.exports = { initLavalink };
