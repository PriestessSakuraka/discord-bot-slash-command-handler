module.exports = class {
    constructor(client) {
        this.client = client
    }

    run(interaction) {
        this.client.SlashCommands.runner(interaction)
    }
}
