const { Client } = require("discord.js")
const modules = require("./Modules")

class CustomClient extends Client {

    /**
     * clientSettings is required to resister slash commands.
     *
     * guildId is optional.
     * if you want to register commands as guild commands,
     * you need to add guildId
     * @param {{ settings: Object, clientOptions: Object, clientSettings: { token: String, clientId: String, guildId: String, developerId: String }}} options
     */
    constructor(options = {}) {
        super(options.clientOptions || {})

        this.settings = options.settings
        this.clientSettings = options.clientSettings

        this.modules = modules

        this.SlashCommands = new modules.SlashCommandsManager({
            settings: options.clientSettings,
            returnFuncs: options.returnFuncs
        })
    }

    login() {
        super.login(this.clientSettings.token)

        this.loadCommands()
        this.loadEvents()

        return this
    }

    loadCommands() {
        modules.Utils.loadFolders("Commands", (files, dir) => files.map(file => {
            this.SlashCommands.add(new (require(`./Commands/${dir}/${file}`)))
            console.log(`loaded ./Commands/${dir}/${file}`)
        }))

        this.SlashCommands.register()
    }

    loadEvents() {
        modules.Utils.loadFolder("Events", eventFiles => {
            for (const file of eventFiles) {
                const event = new (require(`./Events/${file}`))(this)
                const event_name = file.split(".")[0]

                event.once
                    ? super.once(event_name, (...args) => event.run(...args))
                    : super.on(event_name, (...args) => event.run(...args))

                console.log(`loaded ./Events/${file}`)
            }
            console.log("events loaded successfully")
        })
    }
}

module.exports = CustomClient
