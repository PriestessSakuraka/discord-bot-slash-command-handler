const fs = require("node:fs")
const path = require("node:path")

const modules = {}

const modulePath = path.join(__dirname, "src")
const moduleFolder = fs.readdirSync(modulePath).filter(file => file.endsWith(".js"))

for (const moduleFile of moduleFolder) {
    const mod = require(`${modulePath}/${moduleFile}`)
    const module_name = moduleFile.split(".")[0]

    modules[module_name] = mod
    console.log(`Loading module ${module_name}`)
}

module.exports = modules