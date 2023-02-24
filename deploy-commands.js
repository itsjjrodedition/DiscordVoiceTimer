const { REST, Routes } = require('discord.js');
require('dotenv').config()
const fs = require('node:fs');

const globalCommands = [];
const globalCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of globalCommandFiles) {
	const command = require(`./commands/${file}`);
	globalCommands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
	try {
		console.log(`Started refreshing ${globalCommands.length} global (/) command(s).`);

		const globaldata = await rest.put(
			Routes.applicationCommands(process.env.client_id),
			{ body: globalCommands },
		);

		console.log(`Successfully reloaded ${globaldata.length} global (/) command(s).`);

	} catch (error) {
		console.error(error);
	}
})();
