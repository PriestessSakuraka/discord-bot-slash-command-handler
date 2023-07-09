module.exports = class {
    constructor(client) {
        this.client = client
        this.modules = client.modules
    }

    async run(member) {
        const isOffline = member.guild.members.cache.get(mee6_id).presence.status === "offline" ? true : false

        if (isOffline) {
            for (const role of welcome_roles) {
                const targetRole = member.guild.roles.cache.get(role) || member.guild.roles.cache.find(r => r.name === role)
                if (!member.roles.cache.has(targetRole)) await member.roles.add(targetRole)
            }
        }
    }
}