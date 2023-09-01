const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

const editJsonFile = require("edit-json-file");

var file = editJsonFile(`${process.cwd()}/data/call.json`, {
    autosave: true
});

module.exports = {
     data: new ContextMenuCommandBuilder()
	     .setName('Use message timestamp')
	     .setType(ApplicationCommandType.Message),
     async execute(interaction, client){
          var message = await interaction.channel.messages.fetch(interaction.targetId);
          console.log(message.embeds)
          file.set("callStartTime", Date.parse(message.createdAt));
          file.set("callDate", new Date(message.createdAt).toLocaleDateString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
          file.set("callTime", new Date(message.createdAt).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
          await interaction.reply({content: `The call's time has been overriden to \`${message.createdAt}\``, ephemeral: true});
     }
}
