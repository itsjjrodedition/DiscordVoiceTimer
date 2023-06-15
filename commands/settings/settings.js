const { SlashCommandBuilder } = require('@discordjs/builders');

const editJsonFile = require("edit-json-file");

var file = editJsonFile(`${process.cwd()}/settings.json`, {
    autosave: true
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Change the settings of the bot!')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('nickname')
                .setDescription('Toggle the nickname feature!')
                .addBooleanOption(option =>
                    option
                    .setName('toggle')
                    .setDescription('Say the nickname of the user that joins?')
                    .setRequired(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'nickname') {
            const toggle = interaction.options.getBoolean('toggle');
            file.set("nickname", toggle);
            interaction.reply({content: `Nickname feature has been set to ${toggle}`, ephemeral: true});
        }
    }
};