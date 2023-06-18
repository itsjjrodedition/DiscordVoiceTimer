const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

const editJsonFile = require("edit-json-file");

var callFile = editJsonFile(`${process.cwd()}/call.json`, {
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
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(callFile => callFile.endsWith('.js'));

	for (const callFile of commandFiles) {
		const callFilePath = path.join(commandsPath, callFile);
		const command = require(callFilePath);
		client.commands.set(command.data.name, command);
	}
}

client.once(Events.ClientReady, async () => {
	callFile.empty();

	console.log(`Logged in as ${client.user.tag}`);

	rcall.execute(client);

});

client.on(Events.InteractionCreate, async interaction => {
	// console.log(interaction)
	if(interaction.isMessageContextMenuCommand()){
		const command = client.commands.get(interaction.commandName)

		if(!command) return;
		try{
			await command.execute(interaction, client)
		}catch (error) {
			console.error(error)
		}
	}
	if (interaction.isChatInputCommand()){
		const command = client.commands.get(interaction.commandName);

		if (!command) return;
		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			if(interaction.replied){
				await interaction.editReply({ content: 'There was an error while executing this command...', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command...', ephemeral: true });
			}
		}
	}
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

	var settingsFile = editJsonFile(`${process.cwd()}/settings.json`, {
		autosave: true
	});

	var username = newState.member.user.username;
	var nickname = newState.member.nickname;

	var message = ``;

	if(nickname != null && nickname != undefined && settingsFile.get("nickname") == true){
		message = `${nickname}(${username})`;
	} else {
		message = `${username}`;
	}

	console.log(newState.selfVideo)

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
	if( oldState.selfVideo === false && newState.selfVideo === true){
		// User started video
		client.channels.cache.get(config.logchannel).send(`${message} turned their camera on`)
	} else if( oldState.selfVideo === true && newState.selfVideo === false){
		// User stopped video
		client.channels.cache.get(config.logchannel).send(`${message} turned their camera off`)
	}

});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(config.token);
