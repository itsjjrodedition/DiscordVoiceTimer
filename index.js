const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

const config = {
	token: process.env.token,
	logchannel: process.env.auditlogchannel,
	callchannel: process.env.callchannel,
  };

const client = new Client( { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates], ws: { properties: { browser: 'Discord' } }, });

const rcall = require('./functions/call.js');

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, async () => {
	console.log(`Logged in as ${client.user.tag}`);

	rcall.execute(client);

});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()){
		const command = client.commands.get(interaction.commandName);

		if (!command) return;
		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command...', ephemeral: true });
		}
	}
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
	if(!config.logchannel) return;
	if (oldState.channelId === newState.channelId){
		// Still in the same channel
		console.log(newState.member.user.username + " is still in " + newState.channel.name)
	}
	else if (oldState.channelId === null && newState.channelId !== null) {
		// User joined a voice channel
		console.log(newState.member.user.username + " joined " + newState.channel.name)
		client.channels.cache.get(config.logchannel).send(newState.member.user.username + " joined " + newState.channel.name)

	} else if (newState.channelId === null) {
		// User left a voice channel
		console.log(newState.member.user.username + " left " + oldState.channel.name)
		client.channels.cache.get(config.logchannel).send(newState.member.user.username + " left " + oldState.channel.name)
	} else {
		// User switched voice channels
		console.log(newState.member.user.username + " switched from " + oldState.channel.name + " to " + newState.channel.name)
		client.channels.cache.get(config.logchannel).send(newState.member.user.username + " switched from " + oldState.channel.name + " to " + newState.channel.name)
	}
	if( oldState.streaming === true && newState.streaming === false){
		// User stopped streaming
		console.log(newState.member.user.username + " stopped streaming")
		client.channels.cache.get(config.logchannel).send(newState.member.user.username + " stopped streaming")
	} else if( oldState.streaming === false && newState.streaming === true){
		// User started streaming
		console.log(newState.member.user.username + " started streaming")
		client.channels.cache.get(config.logchannel).send(newState.member.user.username + " started streaming")
	} 

});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(config.token);
