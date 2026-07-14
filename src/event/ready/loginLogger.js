const fs = require('fs');

const safeSetSamsungActivity = async (client, packageName, status) => {
    if (!client?.user?.setSamsungActivity) return;

    try {
        await client.user.setSamsungActivity(packageName, status);
    } catch (error) {
        const isDiscordPresenceError = error?.httpStatus === 404 || error?.code === 0;

        if (isDiscordPresenceError) {
            console.warn(`Skipping Samsung activity update for ${packageName} (${status})`);
            return;
        }

        console.warn(`Failed to update Samsung activity for ${packageName} (${status})`, error);
    }
};

module.exports = {
    execute: async(client) => {
        console.log(`Logged in as ${client.user.tag}`)
        await safeSetSamsungActivity(client, 'com.YostarJP.BlueArchive', 'START');

        setTimeout(() => {
            safeSetSamsungActivity(client, 'com.miHoYo.bh3oversea', 'UPDATE');
        }, 30_000);

        setTimeout(() => {
            safeSetSamsungActivity(client, 'com.miHoYo.GenshinImpact', 'STOP');
        }, 60_000);
    },
    once: true
}