const { del } = require("../../functions");
const db = require("../../schemas/db.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "togglexpsystem",
    aliases: ["xptoggle", "togglexp", "levelingtoggle"],
    category: "auto-moderation",
    description: "Toggles the leveling system on or off.",
    permissions: "moderator",
    usage: "<true/enable | false/disable>",
    run: (client, message, args) => {
        if (!message.guild.me.hasPermission("MANAGE_ROLES"))
            return message.reply("I need `MANAGE_ROLES` permissions for the XP system.").then(m => del(m, 7500));

        if (!args[0])
            return message.reply("Please provide a true/false or enable/disable.").then(m => del(m, 7500));

        if (args[0] !== "true" && args[0] !== "enable"
            && args[0] !== "false" && args[0] !== "disable") {
            return message.reply("Please provide a true/false or enable/disable.").then(m => del(m, 7500));
        }

        const logChannel = message.guild.channels.cache.find(c => c.name === "mod-logs") || message.channel;
        let guildID = message.guild.id;
        let bool;

        if (args[0] === "true" || args[0] === "enable") {
            bool = true;
        } else {
            bool = false;
        }

        const embed = new MessageEmbed()
            .setColor("#0efefe")
            .setTitle("XP System Toggled")
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`
            **XP system toggled by:** ${message.member.user}
            **XP system toggled to:** ${bool}`);

        db.updateOne({ guildID: guildID }, {
            $set: { xpSystem: bool }
        }).catch(err => console.log(err))

        logChannel.send(embed)
        return message.reply(`The XP system has been toggled to ${args[0]}.`).then(m => del(m, 7500));
    }
}