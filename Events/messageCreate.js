module.exports = class {
    constructor(client) {
        this.client = client
        this.settings = client.settings
    }

    run(message) {
        if (message.content === "ping") {
            message.channel.send("pong!")
        }
    }
}
