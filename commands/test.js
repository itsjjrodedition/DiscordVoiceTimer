const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
     data: new ContextMenuCommandBuilder()
	.setName('Override time')
	.setType(ApplicationCommandType.Message),
     async execute(){
    	console.log(interaction)
     }
}