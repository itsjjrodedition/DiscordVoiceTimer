const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ChannelType } = require('discord.js');
require('dotenv').config()

const editJsonFile = require("edit-json-file");

var callFile = editJsonFile(`${process.cwd()}/data/call.json`, {
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
	var count = 0;

	const voiceChannels = client.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
	for(const[id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;

	const guilds = client.guilds.cache.map(guild => guild.id)

	var settingsFile = editJsonFile(`${process.cwd()}/settings.json`, {
		autosave: true
	});

	var username = newState.member.user.username;
	var nickname = newState.member.displayName || newState.member.nickname;

	var message = ``;


	if(settingsFile.get("nickname") == true){
		if(nickname == null){
			nickname = username;
		}
		message = `${nickname}`;
	} else if(settingsFile.get("nickname") == false){
		message = `${username}`;
	}else {
		message = `${nickname}(${username})`;
	}

	if(!config.logchannel) return;
	if (oldState.channelId === newState.channelId){
		// Still in the same channel
	}
	else if (oldState.channelId === null && newState.channelId !== null) {
		// User joined a voice channel
    	for(const guild of guilds){
    	    const cached = client.guilds.cache.get(guild)
    	    cached.members.cache.get(client.user.id).setNickname(`📞 ${count} in call`)
    	}

		return client.channels.cache.get(config.logchannel).send(`${message} joined <#${newState.channel.id}>`)

	} else if (newState.channelId === null) {
		// User left a voice channel
		client.channels.cache.get(config.logchannel).send(`${message} left <#${oldState.channel.id}>`)
        if(count >= 1){
<<<<<<< HEAD
		for(const guild of guilds){
    	    const cached = client.guilds.cache.get(guild)
    	    cached.members.cache.get(client.user.id).setNickname(`📞 ${count} in call`)
    	}
=======
			for(const guild of guilds){
    		   	const cached = client.guilds.cache.get(guild)
    		    cached.members.cache.get(client.user.id).setNickname(`📞 ${count} in call`)
    		}
>>>>>>> main
		}
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
	if( oldState.selfMute === false && newState.selfMute === true){
		// User muted
		client.channels.cache.get(config.logchannel).send(`${message} muted themself`)
	} else if( oldState.selfMute === true && newState.selfMute === false){
		// User unmuted
		client.channels.cache.get(config.logchannel).send(`${message} unmuted themself`)
	}
	if( oldState.selfDeaf === false && newState.selfDeaf === true){
		// User deafened
		client.channels.cache.get(config.logchannel).send(`${message} deafened themself`)
	} else if( oldState.selfDeaf === true && newState.selfDeaf === false){
		// User undeafened
		client.channels.cache.get(config.logchannel).send(`${message} undeafened themself`)
	}
	if( oldState.serverDeaf === false && newState.serverDeaf === true){
		// User was server deafened
		client.channels.cache.get(config.logchannel).send(`${message} was deafened by a moderator`)
	} else if( oldState.serverDeaf === true && newState.serverDeaf === false){
		// User was server undeafened
		client.channels.cache.get(config.logchannel).send(`${message} was undeafened by a moderator`)
	}
	if( oldState.serverMute === false && newState.serverMute === true){
		// User was server muted
		client.channels.cache.get(config.logchannel).send(`${message} was muted by a moderator`)
	} else if( oldState.serverMute === true && newState.serverMute === false){
		// User was server unmuted
		client.channels.cache.get(config.logchannel).send(`${message} was unmuted by a moderator`)
	}
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.login(config.token);
