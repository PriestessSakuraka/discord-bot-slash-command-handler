const { SlashCommandBuilder } = require("discord.js")

module.exports = class {
    constructor() {
        this.cmd = new SlashCommandBuilder()
            .setName("echo")
            .setDescription("echooo")
            .addStringOption(option => option.setName("input").setDescription("The input to echo back").setRequired(true))

        this.options = {
            cooldown: 10 // sec
        }
    }

    async run(interaction) {
        const string = interaction.options.getString("input")
        await interaction.reply({ content: string, ephemeral: true })
    }
}