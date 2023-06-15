const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('joincall')
        .setDescription('Make the bot join the call! (no use yet)'),

    async execute(interaction) {
        const duration = interaction.options.getString('duration');

        if(duration == null) {
            interaction.reply({content: `You must specify a duration!`, ephemeral: true});
            return;
        }

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
