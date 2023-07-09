const { Collection } = require("discord.js")

/*
Collection<> cooldown = new Collection<int memberId, Collection<String cooldownTag, int Date.now()>>()
*/
class CooldownManager {
    constructor() {
        this.cooldown = new Collection()
    }

    /**
     * @param {{ memberId: String, cooldownTag: String, cooldown: Number }} options cooldown would be second.
     */
    add(options) {
        const { memberId, cooldownTag, cooldown } = options
        const cooldownAmount = cooldown * 1000

        const now = Date.now()

        if (!this.cooldown.has(memberId)) {
            this.cooldown.set(memberId, new Collection())
        }

        const timestamps = this.cooldown.get(memberId)

        timestamps.set(cooldownTag, {
            now: now,
            cooldownAmount: cooldownAmount
        })

        this._removeTimestamp(timestamps, cooldownTag, cooldownAmount)
    }

    get(memberId, cooldownTag) {
        if (this.has(memberId, cooldownTag)) {
            const now = Date.now()
            const timestamps = this.cooldown.get(memberId)
            const timestamp = timestamps.get(cooldownTag)

            const expirationTime = timestamp.now + timestamp.cooldownAmount

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return timeLeft.toFixed(1)
            }
        }
    }

    has(memberId, cooldownTag) {
        if (this.cooldown.has(memberId)) {
            const timestamps = this.cooldown.get(memberId)
            if (timestamps.has(cooldownTag)) {
                return true
            }
        }

        return false
    }

    _removeTimestamp(timestamps, cooldownTag, cooldownAmount) {
        setTimeout(() => timestamps.delete(cooldownTag), cooldownAmount)
    }
}

module.exports = CooldownManager