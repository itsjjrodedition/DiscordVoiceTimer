const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()

const data = new ContextMenuCommandBuilder()
	.setName('User Information')
	.setType(ApplicationCommandType.User);
