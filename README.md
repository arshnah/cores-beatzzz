<div align="center">

# 🎵 cores-beatzzz

**A high-performance, robust Discord Music Bot powered by Node.js, Discord.js v14, and Lavalink.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Lavalink](https://img.shields.io/badge/Lavalink-v4-red?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/lavalink-devs/Lavalink)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## 🚀 Recent Updates

- 🔊 **Volume Control Command (`c!vol`)**: Added a dedicated `c!vol <0-200>` command to adjust player volume dynamically in real-time.
- 🛠️ **Lavalink v4 API Fix**: Fixed REST update payload format (`{ track: { encoded: ... } }`) to resolve HTTP 400 Bad Request errors.
- 🛡️ **Bot Architecture Migration**: Fully removed all legacy selfbot libraries and converted the application to a standard Discord Bot account using Discord.js v14 and Shoukaku.

---

## ✨ Features

- 🎧 **Lavalink Audio Core**: Crystal clear audio playback backed by Lavalink server node architecture.
- 📜 **Queue System**: Full song queuing support with seamless auto-next playback.
- 🔊 **Volume Adjustment**: Real-time volume control ranging from `0` to `200%`.
- ⚡ **Prefix Commands**: Simple and fast text commands (`c!play`, `c!skip`, `c!stop`, `c!vol`, `c!ping`).
- 🌐 **Uptime Keep-Alive**: Built-in Express server for cloud hosting health-checks / pings.
- 🛡️ **Bot Architecture**: Standard Discord Bot Account with Privileged Gateway Intents.

---

## 📋 Prerequisites

Before running **cores-beatzzz**, ensure you have the following installed:

1. **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
2. **Java Runtime (JRE/JDK)**: `Java 17` or higher (Required to run Lavalink server)
3. **Discord Bot Token**: A registered bot application on the [Discord Developer Portal](https://discord.com/developers/applications)
4. **Lavalink v4 Server**: A running Lavalink server instance (local or remote)

---

## 🛠️ Step-by-Step Setup Guide

### Step 1: Set Up Discord Bot Application
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**, name your bot, and save.
3. Go to the **Bot** tab:
   - Click **Reset Token** to copy your bot **TOKEN** (keep this secret!).
   - Scroll down to **Privileged Gateway Intents** and enable:
     - ✅ **MESSAGE CONTENT INTENT**
     - ✅ **SERVER MEMBERS INTENT** (optional)
     - ✅ **PRESENCE INTENT** (optional)
4. Go to **OAuth2 -> URL Generator**:
   - Select scopes: `bot`
   - Select bot permissions: `Connect`, `Speak`, `Send Messages`, `Read Message History`, `View Channels`
   - Copy the generated URL and use it to invite the bot to your server.

---

### Step 2: Set Up Lavalink Server
Lavalink handles searching, decoding, and streaming audio.

#### Option A: Running Locally with Java
1. Download the latest `Lavalink.jar` release from [Lavalink Releases](https://github.com/lavalink-devs/Lavalink/releases).
2. Create an `application.yml` file in the same directory as `Lavalink.jar`:
   ```yaml
   server:
     port: 2333
     address: 0.0.0.0
   lavalink:
     server:
       password: "youshallnotpass"
       sources:
         youtube: true
         bandcamp: true
         soundcloud: true
         twitch: true
         vimeo: true
         http: true
         local: false
       bufferDurationMs: 400
       frameBufferDurationMs: 5000
       youtubeSearchEnabled: true
       soundcloudSearchEnabled: true
   ```
3. Launch Lavalink:
   ```bash
   java -jar Lavalink.jar
   ```

#### Option B: Running with Docker
```bash
docker run -d --name lavalink -p 2333:2333 ghcr.io/lavalink-devs/lavalink:v4
```

---

### Step 3: Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/coreqt/cores-beatzzz.git
cd cores-beatzzz

# Install Node.js dependencies
npm install
```

---

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory of the project:

```env
# Discord Configuration
TOKEN=your_discord_bot_token_here

# Lavalink Node Configuration
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
LAVALINK_SECURE=false

# Keep-Alive Server Configuration (Optional)
PORT=3000
```

#### Environment Variable Glossary

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `TOKEN` | Discord Bot token from Developer Portal | - | **Yes** |
| `LAVALINK_HOST` | Host IP / hostname of your Lavalink node | `localhost` | **Yes** |
| `LAVALINK_PORT` | Port number of your Lavalink node | `2333` | **Yes** |
| `LAVALINK_PASSWORD` | Authentication password set in `application.yml` | `youshallnotpass` | **Yes** |
| `LAVALINK_SECURE` | Set to `true` if Lavalink uses HTTPS/WSS | `false` | **Yes** |
| `PORT` | Web server port for keep-alive pings | `3000` | No |

---

### Step 5: Start the Bot

```bash
# Production mode
npm start

# Development mode (with live reload)
npm run dev
```

Upon successful startup, you will see output similar to:
```text
Keep Alive Server started on port 3000
Logged in as YourBotName#1234
[Lavalink] Node default is ready.
```

---

## 🎮 Command Usage

Default Prefix: `c!` (Configurable in `src/config/config.json`)

| Command | Usage | Description |
| :--- | :--- | :--- |
| `play` | `c!play <song name or URL>` | Joins your voice channel and plays audio from YouTube/supported sources. |
| `skip` | `c!skip` | Skips the current track and starts playing the next song in queue. |
| `stop` | `c!stop` | Stops playback, clears the guild song queue, and leaves the voice channel. |
| `vol` | `c!vol <0-200>` | Adjusts global playback volume between 0% and 200%. |
| `ping` | `c!ping` | Replies with a connectivity confirmation message. |

---

## 📁 Project Structure

```text
cores-beatzzz/
├── src/
│   ├── command/         # Command modules (play, skip, stop, vol, ping)
│   │   ├── ping/
│   │   ├── play/
│   │   ├── skip/
│   │   ├── stop/
│   │   └── vol/
│   ├── config/          # Bot prefix and configuration
│   ├── core/            # Client initialization, Lavalink setup, & web server
│   │   ├── keepAlive.js
│   │   ├── lavalink.js
│   │   └── main.js
│   ├── event/           # Event handlers (messageCreate, ready)
│   │   ├── messageCreate/
│   │   └── ready/
│   ├── utils/           # Lavalink channel connection and track playback helpers
│   │   ├── connectToChannel.js
│   │   └── playTrack.js
│   └── index.js         # Main entry point
├── .env                 # Environment variables (git-ignored)
├── package.json
└── README.md
```

---

## ❓ Troubleshooting & FAQs

<details>
<summary><b>Bot does not respond to commands</b></summary>
Ensure <code>MESSAGE CONTENT INTENT</code> is turned ON in the Discord Developer Portal under your application's <b>Bot</b> settings.
</details>

<details>
<summary><b>Error: No available Lavalink node connection</b></summary>
Make sure your Lavalink server is running and accessible on the host and port specified in your <code>.env</code> file. Check that the <code>LAVALINK_PASSWORD</code> matches your Lavalink configuration.
</details>

<details>
<summary><b>Bot joins voice channel but no audio plays</b></summary>
Verify that the Lavalink node has valid YouTube source plugins enabled and that the server machine has network access to audio providers.
</details>

---

<div align="center">
  <sub>Built with ❤️ by coreqt</sub>
</div>