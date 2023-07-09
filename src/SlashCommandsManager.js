const Types = require("../src/Types")
const Utils = require("../src/Utils")
const CooldownManager = require("../src/CooldownManager")
const SlashCommandsLoader = require("../src/SlashCommandsLoader")

const { Collection } = require("discord.js")

/**
 * 簡単にSlashCommandを実装できるクラス
 *
 * @class
 */
class SlashCommandsManager {

    constructor(options = {}) {
        const { settings, returnFuncs } = options

        this.SlashCommandsLoader = new SlashCommandsLoader({
            clientId: settings.clientId,
            token: settings.token
        })

        this.cooldown = new CooldownManager()

        this.commands = new Collection()
        this.buttonHandlers = new Collection()
        this.selectMenuHandlers = new Collection()

        /** @type {{ cooldown: Function, roles: Function, requiredRoles: Function developer: Function }} */
        this.returnFuncs = returnFuncs || {}

        /** @type {String[]} */
        this.developerIds = settings.developerIds

        /** @type {String} */
        this.guildId = settings.guildId
    }

    _syncCommands() {
        const commands = [...this.commands.values()].map(v => v.cmd.toJSON())
        this.SlashCommandsLoader.commands.push(...commands)
    }

    register(guildId) {
        this._syncCommands()

        if (guildId) {
            this.SlashCommandsLoader.registerGuildCommands(guildId)
        } else if (this.guildId) {
            this.SlashCommandsLoader.registerGuildCommands(this.guildId)
        } else {
            this.SlashCommandsLoader.registerCommands()
        }
    }

    /**
     * @param {{ cmd: Discord.SlashCommandBuilder, buttons: { customId: String, handler: Function }[] }} obj
     * @returns {this}
     */
    add(obj = {}) {
        if (!obj.cmd) return console.error("No command provided.")

        this.addCommand(obj)

        if (Types.isArray(obj.buttons)) {
            this.addButtons(obj.buttons)
        }

        if (obj.selectMenuHandler?.customId && obj.selectMenuHandler.run) {
            this.addSelectMenuHandler(obj.selectMenuHandler)
        }

        return this
    }

    addCommand(command) {
        const SlashCommandData = command.cmd.toJSON()
        this.commands.set(SlashCommandData.name, {
            cmd: command.cmd,
            run: command.run,
            options: command.options
        })

        return this
    }

    addCommands(commands = []) {
        for (const command of commands) {
            this.addCommand(command)
        }

        return this
    }

    addButton(button) {
        this.buttonHandlers.set(button.customId, button.run)

        return this
    }

    addButtons(buttons = []) {
        for (const button of buttons) {
            this.addButton(button)
        }

        return this
    }

    addSelectMenuHandler(handler) {
        this.selectMenuHandlers.set(handler.customId, handler.run)
    }

    runner(interaction) {
        this.commandHandler(interaction)
        this.buttonHandler(interaction)
        this.selectMenuHandler(interaction)
    }

    commandHandler(interaction) {
        if (!interaction.isChatInputCommand()) return

        if (this.commands.has(interaction.commandName)) {
            const command = this.commands.get(interaction.commandName)

            // クールダウン判定
            if (Types.isNumber(command.options?.cooldown)) {
                if (this.cooldown.has(interaction.member.id, interaction.commandName)) {
                    if (!this.returnFuncs.cooldown) {
                        return Utils.rejectMessage(interaction, {
                            type: "COOLDOWN",
                            cooldown: this.cooldown.get(interaction.member.id, interaction.commandName)
                        })
                    }
                    return this.returnFuncs.cooldown(interaction)
                }

                this.cooldown.add({
                    memberId: interaction.member.id,
                    cooldownTag: interaction.commandName,
                    cooldown: command.options.cooldown
                })
            }
            // ロール判定 (or条件)
            if (Types.isArray(command.options?.roles)) {
                if (!Utils.hasRoles(interaction, command.options.roles)) {
                    if (!this.returnFuncs.roles) return Utils.rejectMessage(interaction, { type: "ROLE", roles: command.options.roles })
                    return this.returnFuncs.roles(interaction)
                }
            }
            // ロール判定 (and条件)
            if (Types.isArray(command.options?.requiredRoles)) {
                if (!Utils.hasAllRoles(interaction, command.options.requiredRoles)) {
                    if (!this.returnFuncs.roles) return Utils.rejectMessage(interaction, { type: "ROLE", roles: command.options.requiredRoles })
                    return this.returnFuncs.requiredRoles(interaction)
                }
            }
            // 開発者判定
            if (Types.isBoolean(command.options?.developer)) {
                if (!this.developerIds.some(id => id === interaction.user.id)) {
                    if (!this.returnFuncs.developer) return Utils.rejectMessage(interaction, { type: "DEVELOPER" })
                    return this.returnFuncs.developer(interaction)
                }
            }

            command.run(interaction)
        }
    }

    buttonHandler(interaction) {
        if (!interaction.isButton()) return

        if (this.buttonHandlers.has(interaction.customId)) {
            this.buttonHandlers.get(interaction.customId)(interaction)
        }
    }

    selectMenuHandler(interaction) {
        if (!interaction.isStringSelectMenu()) return

        if (this.selectMenuHandlers.has(interaction.customId)) {
            this.selectMenuHandlers.get(interaction.customId)(interaction)
        }
    }
}

module.exports = SlashCommandsManager