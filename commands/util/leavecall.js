const { SlashCommandBuilder, messageLink } = require('discord.js');

const { getVoiceConnection } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('leavecall')
        .setDescription('Has the bot leave the call'),

    async execute(interaction) {
        
        const connection = getVoiceConnection(interaction.guild.id);
        
        if(!connection) return interaction.reply({content: `The bot is not in a call!`, ephemeral: true});
        interaction.reply({content: `Left the call`, ephemeral: true});

        connection.destroy();

    }
}
