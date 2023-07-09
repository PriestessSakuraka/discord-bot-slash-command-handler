module.exports = class {
    constructor(client) {
        this.client = client
    }

    async run(member) {
        for (const role of this.settings.welcome_roles) {
            const targetRole = member.guild.roles.cache.get(role) || member.guild.roles.cache.find(r => r.name === role)
            if (!member.roles.cache.has(targetRole)) await member.roles.add(targetRole)
        }
    }
}
