const { EmbedBuilder } = require('discord.js');

function formatDuration(ms) {
    if (!ms || isNaN(ms) || ms <= 0) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function nowPlayingEmbed({ title, url, duration, requester, thumbnail }) {
    const embed = new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('▶ Now Playing')
        .setDescription(url ? `[${title}](${url})` : `**${title}**`)
        .addFields({ name: 'Duration', value: formatDuration(duration), inline: true });

    if (requester) {
        embed.addFields({ name: 'Requested by', value: String(requester), inline: true });
    }

    if (thumbnail && typeof thumbnail === 'string' && thumbnail.trim() !== '') {
        embed.setThumbnail(thumbnail);
    }

    embed.setFooter({ text: 'cores-beatzzz • Lavalink' });
    return embed;
}

function queuedEmbed({ title, position }) {
    return new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('✅ Added to Queue')
        .setDescription(`**${title}**`)
        .addFields({ name: 'Position', value: `#${position} in queue`, inline: true })
        .setFooter({ text: 'cores-beatzzz • Lavalink' });
}

function queueListEmbed({ tracks = [], currentTitle, page = 1, totalPages = 1, totalTracks = 0, startIndex = 0 }) {
    const nowPlayingText = currentTitle
        ? `**Now Playing:** ${currentTitle}`
        : '*Nothing currently playing*';

    let bodyText = 'Queue is empty.';
    if (tracks && tracks.length > 0) {
        bodyText = tracks
            .map((t, idx) => {
                const pos = startIndex + idx + 1;
                const trackTitle = t.title || t.query || 'Unknown Track';
                return `**${pos}.** ${trackTitle}`;
            })
            .join('\n');
    }

    return new EmbedBuilder()
        .setColor('#FF6B6B')
        .setTitle('🎶 Music Queue')
        .setDescription(`${nowPlayingText}\n\n**Upcoming:**\n${bodyText}`)
        .setFooter({ text: `Page ${page}/${totalPages} • ${totalTracks} tracks total` });
}

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(description || 'An error occurred.')
        .setFooter({ text: 'cores-beatzzz • Lavalink' });
}

module.exports = {
    nowPlayingEmbed,
    queuedEmbed,
    queueListEmbed,
    errorEmbed,
    formatDuration
};
