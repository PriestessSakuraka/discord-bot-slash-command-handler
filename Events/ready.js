module.exports = class {
    constructor(client) {
        this.client = client
        this.settings = client.settings
        this.once = true
    }

    run() {
        const texts = [
            "----------",
            "Starting bot...",
            `NAME: ${this.client.user.tag}`,
            `ID: ${this.client.user.id}`,
            `Resistered SlashCommands: ${this.client.SlashCommands.commands.size}`,
            "----------"
        ]

        console.log(texts.join("\n"))
    }
}