const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('joincall')
        .setDescription('Make the bot join the call! (no use yet)'),

    async execute(interaction) {

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            interaction.reply({content: `You must be in a voice channel to use this command!`, ephemeral: true});
            return;
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
    }
};
