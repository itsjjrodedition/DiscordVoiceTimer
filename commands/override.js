const { SlashCommandBuilder } = require('@discordjs/builders');

const call = require('../functions/call.js');
const editJsonFile = require("edit-json-file");

var file = editJsonFile(`${process.cwd()}/call.json`, {
    autosave: true
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('override')
        .setDescription('Override the call')
        .setDMPermission(false)
        .addStringOption(option =>
            option
            .setName('time')
            .setDescription('Are you manually overriding the call?')
            .setRequired(true)
            .addChoices(
                {name: 'Yes', value: 'yes'},
                {name: 'No', value: 'no'}
            )
        )
        .addStringOption(option =>
            option
            .setName('messageid')
            .setDescription('The embed message ID of the previous call')
            .setRequired(false)
        ),
    async execute(interaction, client) {
        if(interaction.options.getString('time') == 'yes') {
            const messageid = interaction.options.getString('messageid');
            if(messageid != null) {
                const message = await interaction.channel.messages.fetch(messageid);
                file.set("callStartTime", Date.parse(message.createdAt));
                interaction.reply({content: `The call's time has been overriden to \`${message.createdAt}\``, ephemeral: true});
            } else {
                interaction.reply({content: 'WIP', ephemeral: true});
            }  
        }
    }
}