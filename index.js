const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

const editJsonFile = require("edit-json-file");

var file = editJsonFile(`${process.cwd()}/call.json`, {
    autosave: true
});

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
	file.empty();

	console.log(`Logged in as ${client.user.tag}`);

	rcall.execute(client);

});

client.on(Events.InteractionCreate, async interaction => {
	// console.log(interaction)
	if(interaction.isMessageContextMenuCommand()){
		console.log(interaction)
		interaction.deferReply()
	}
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

	var username = newState.member.user.username;
	var nickname = newState.member.nickname;

	var message = ``;

	if(nickname != null){
		message = `${nickname}(${username})`;
	} else {
		message = `${username}`;
	}

	if(!config.logchannel) return;
	if (oldState.channelId === newState.channelId){
		// Still in the same channel
	}
	else if (oldState.channelId === null && newState.channelId !== null) {
		// User joined a voice channel
		client.channels.cache.get(config.logchannel).send(`${message} joined <#${newState.channel.id}>`)

	} else if (newState.channelId === null) {
		// User left a voice channel
		client.channels.cache.get(config.logchannel).send(`${message} left <#${oldState.channel.id}>`)
	} else {
		// User switched voice channels
		client.channels.cache.get(config.logchannel).send(`${message} switched from <#${oldState.channel.id}> to <#${newState.channel.id}>`)
	}
	if( oldState.streaming === true && newState.streaming === false && oldState.channelId != null){
		// User stopped streaming
		client.channels.cache.get(config.logchannel).send(`${message} stopped streaming`)
	} else if( oldState.streaming === false && newState.streaming === true){
		// User started streaming
		client.channels.cache.get(config.logchannel).send(`${message} started streaming`)
	} 

});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(config.token);
