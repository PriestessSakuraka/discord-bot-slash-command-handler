const fs = require("node:fs")
const path = require("node:path")

const Types = require("../src/Types")
const { EmbedBuilder } = require("discord.js")

/**
 * Utilities for development
 */
class Utils {

    /**
     * @param {String} folder_name
     * @param {Function} fn
     */
    static loadFolder(folder_name, fn) {
        const commandPath = path.join(`${__dirname}/..`, folder_name)
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"))

        if (!Types.isFunction(fn)) return console.error("[Utils.loadFolder]: Second argument must be a function.")
        fn(commandFiles)
    }

    /**
     * @param {String} folder_name
     * @param {Function} fn
     */
    static loadFolders(folder_name, fn) {
        const commandPath = path.join(`${__dirname}/..`, folder_name)

        for (const dir of fs.readdirSync(commandPath)) {
            const commandFiles = fs.readdirSync(`${commandPath}/${dir}`).filter(file => file.endsWith(".js"))

            if (!Types.isFunction(fn)) return console.error("[Utils.loadFolder]: Second argument must be a function.")
            fn(commandFiles, dir)
        }
    }

    /**
     * Cleans discord markdown from string provided.
     * @param {String} text
     * @returns {String}
     */
    static cleanText(text) {
        if (Types.isString(text))
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
        else return text
    }

    /**
     * @param {Discord.Interaction} interaction
     * @param {String[]} roles
     * @returns {String[]} role ids which member has.
     */
    static checkRoles(interaction, roles = []) {
        const ownRoles = []

        for (const role of roles) {
            const targetRole = interaction.guild.roles.cache.get(role) || interaction.guild.roles.cache.find(r => r.name === role)
            if (!targetRole) continue;

            if (interaction.member.roles.cache.has(targetRole.id)) {
                ownRoles.push(targetRole.id)
            }
        }

        return ownRoles
    }

    /**
     * @param {Discord.Interaction} interaction
     * @param {String[]} roles
     * @returns {boolean}
     */
    static hasRoles(interaction, roles = []) {
        if (this.checkRoles(interaction, roles).length > 0) return true
        return false
    }

    static hasAllRoles(interaction, roles = []) {
        if (this.checkRoles(interaction, roles).length === roles.length) return true
        return false
    }

    /**
     * @param {Discord.Interaction} interaction
     * @param {{ type: String, roles: String[], cooldown: Number }} options
     */
    static async rejectMessage(interaction, options) {
        const {
            type,
            roles,
            cooldown
        } = options

        const embed = new EmbedBuilder()
            .setColor("#ccffff")
            .setTimestamp()
            .setFooter({
                text: `Replying to ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL({ format: "png" })
            })

        if (type === "COOLDOWN") {
            embed.setDescription(`再使用まで${cooldown}秒待ってください。`)
        } else if (type === "ROLE") {
            embed.setDescription(`コマンドに必要なロールが不足しています。\n必要ロール: ${roles.join(", ")}`)
        } else if (type === "DEVELOPER") {
            embed.setDescription(`このコマンドの使用には開発者権限が必要です。`)
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}

module.exports = Utils