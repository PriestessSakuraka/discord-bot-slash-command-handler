const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require("discord.js")

module.exports = {
    cmd: new SlashCommandBuilder().setName("botan").setDescription("This is only for developers."),
    options: {
        developer: true
    },
    run: async interaction => {
        const button = new ButtonBuilder().setCustomId("test_button").setLabel("0w0").setStyle(ButtonStyle.Primary)
        const row = new ActionRowBuilder().addComponents(button)

        await interaction.reply({ content: "-", ephemeral: true })

        interaction.channel.send({ content: "Let's push the button!", components: [row] })
    },
    buttons: [
        {
            customId: "test_button",
            run: async interaction => {
                const role = interaction.guild.roles.cache.find(r => r.name === "おはいめん")

                const role_embed_test = new EmbedBuilder()
                    .setColor("#ccffff")
                    .setTimestamp()
                    .setTitle(`**Result of Role Button**`)
                    .setFooter({
                        text: `Replying to ${interaction.user.tag}`,
                        iconURL: interaction.user.avatarURL({ format: "png" })
                    })

                if (!interaction.member.roles.cache.has(role.id)) {
                    interaction.member.roles.add(role)
                    await interaction.reply({
                        embeds: [role_embed_test.setDescription(`${role.name} has added to ${interaction.user.tag}`)],
                        ephemeral: true
                    })
                } else {
                    interaction.member.roles.remove(role)
                    await interaction.reply({
                        embeds: [
                            role_embed_test
                                .setDescription(`${role.name} has removed from ${interaction.user.tag}`)
                                .setColor("#ccccff")
                        ],
                        ephemeral: true
                    })
                }
            }
        }
    ]
}