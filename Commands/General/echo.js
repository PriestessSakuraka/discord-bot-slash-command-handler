const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    cmd: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("echooo")
        .addStringOption(option => option.setName("input").setDescription("The input to echo back").setRequired(true)),
    options: {
        cooldown: 10 // sec
    },
    run: async interaction => {
        const string = interaction.options.getString("input")
        await interaction.reply({ content: string, ephemeral: true })
    }
}