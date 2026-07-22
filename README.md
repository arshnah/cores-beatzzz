# cores-beatzzz
Discord Music bot built with discord.js v14 and Lavalink.

## Requirements
A Lavalink server must be running separately to handle audio resolution and playback.

## Environment Variables
Create a `.env` file in the root directory with the following environment variables:

- `TOKEN`: Your Discord bot account token.
- `LAVALINK_HOST`: Host address of the Lavalink server (e.g. `localhost` or `127.0.0.1`).
- `LAVALINK_PORT`: Port of the Lavalink server (e.g. `2333`).
- `LAVALINK_PASSWORD`: Password for authenticating with the Lavalink server.
- `LAVALINK_SECURE`: Set to `true` if using SSL/TLS (wss/https), otherwise `false`.
- `PORT` (Optional): Port for the keep-alive Express server (defaults to `3000`).

## Running the Bot
```bash
npm start
```
