const { SlashCommandBuilder } = require("discord.js")
const Utils = require("../../src/Utils")
const os = require("os")
const progressbar = require("string-progressbar")

module.exports = class {
    constructor() {
        this.cmd = new SlashCommandBuilder()
            .setName("status")
            .setDescription("show status of the server which bots running")

        this.options = {
            cooldown: 10 // sec
        }
    }

    async run(interaction)  {
        let cpupercent = os.loadavg()[1]

        let ram = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10
        let rampercent = Math.round((ram / Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100) * 1000) / 10

        const date = new Date(interaction.client.uptime)
        const uptime = `${date.getUTCFullYear() - 1970}y ${date.getUTCMonth()}m ${date.getUTCDate() - 1}d
                        ${date.getUTCHours()}h ${date.getUTCMinutes()}m ${date.getUTCSeconds()}s`

        const embed = Utils.embedBuilder({
            color: "#EEFFFF",
            title: "Bot Status",
            fields: [
                {
                    name: "node.js",
                    value: `${process.version.slice(1)}`
                },
                {
                    name: "discord.js",
                    value: `${require("discord.js").version}`
                },
                {
                    name: "CPU Status",
                    value: `\`[${progressbar.filledBar(100, cpupercent, 20)[0]}]  [${Math.round(cpupercent)}%]\``
                },
                {
                    name: "Memory Status",
                    value: `\`[${ram} / ${Math.round(Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100)}MB]\n[${progressbar.filledBar(100, rampercent, 20)[0]}] [${Math.round((ram / 512) * 100)}%]\``
                },
                {
                    name: "Uptime",
                    value: uptime
                }
            ],
            timestamp: true
        })

        await interaction.reply({ embeds: [embed] })
    }
}