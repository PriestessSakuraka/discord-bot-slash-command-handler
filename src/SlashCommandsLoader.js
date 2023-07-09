const { REST } = require("@discordjs/rest")
const { Routes } = require("discord.js")

/**
 * Discordにスラッシュコマンドを登録する用
 *
 * @class
 */
class SlashCommandsLoader {

    /**
     * @param {{ clientId: String, token: String, commands: Object[] }} options
     */
    constructor(options = {}) {
        const { clientId, token, commands } = options

        this.clientId = clientId
        this.token = token

        this.commands = commands || []
        this.rest = new REST({ version: "10" }).setToken(token)
    }

    /**
     * Registers commands to the server that specified by id.
     *
     * @param {String} guildId
     * @returns {this}
     */
    async registerGuildCommands(guildId) {
        try {
            console.log(`Started refreshing ${this.commands.length} application (/) commands.`)

            await this.rest
                .put(Routes.applicationGuildCommands(this.clientId, guildId), { body: this.commands })
                .then(data => console.log(`Successfully registered ${data.length} application commands.`))
                .catch(console.error)
        } catch (err) {
            console.error(err)
        }

        return this
    }

    /**
     * Registers commands as global command.
     *
     * @returns {this}
     */
    async registerCommands() {
        try {
            console.log(`Started refreshing ${this.commands.length} application (/) commands.`)

            await this.rest
                .put(Routes.applicationCommands(this.clientId), { body: this.commands })
                .then(data => console.log(`Successfully registered ${data.length} application commands.`))
                .catch(console.error)
        } catch (err) {
            console.error(err)
        }

        return this
    }
}

module.exports = SlashCommandsLoader