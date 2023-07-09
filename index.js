const settings = require("./settings.json")
const { DISCORD_BOT_TOKEN } = require("./token.json")

const Client = require("./Client")
const { GatewayIntentBits } = require("discord.js")

const client = new Client({
    settings: settings,
    clientOptions: {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    },
    clientSettings: {
        token: DISCORD_BOT_TOKEN,
        clientId: settings.client_id,
        guildId: settings.guild_id,
        developerIds: settings.developer_ids
    }
})

client.login()
