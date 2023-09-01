const { SlashCommandBuilder } = require('discord.js');

const call = require('../../functions/call.js');
const editJsonFile = require("edit-json-file");

var file = editJsonFile(`${process.cwd()}/data/call.json`, {
    autosave: true
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('override')
        .setDescription('Override the call')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('auto')
                .setDescription('Automatically change the time of the call using another message\'s timestamp!')
                .addStringOption(option =>
                    option
                    .setName('messageid')
                    .setDescription('The embed message ID of the previous call')
                    .setRequired(true)
                )
                .addStringOption(option =>
                    option
                    .setName('channelid')
                    .setDescription('The ID of the channel containing the message (if not in the same channel)')
                    .setRequired(false)
                )
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('manual')
                .setDescription('Manually assign the calls date and time!')
                .addStringOption(option =>
                    option
                    .setName('month')
                    .setDescription('The month of the call')
                    .setRequired(true)
                    .addChoices(
                        {name: 'January', value: 'Jan'},
                        {name: 'February', value: 'Feb'},
                        {name: 'March', value: 'Mar'},
                        {name: 'April', value: 'Apr'},
                        {name: 'May', value: 'May'},
                        {name: 'June', value: 'Jun'},
                        {name: 'July', value: 'Jul'},
                        {name: 'August', value: 'Aug'},
                        {name: 'September', value: 'Sep'},
                        {name: 'October', value: 'Oct'},
                        {name: 'November', value: 'Nov'},
                        {name: 'December', value: 'Dec'},
                    )
                )
                .addIntegerOption(option =>
                    option
                    .setName('day')
                    .setDescription('The day of the call (1-31)')
                    .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                    .setName('year')
                    .setDescription('The year of the call (2015 - current year)')
                    .setRequired(true)
                    .addChoices(
                        {name: '2021', value: 2021},
                        {name: '2022', value: 2022},
                        {name: '2023', value: 2023},
                    )    
                )
                .addIntegerOption(option =>
                    option
                    .setName('hour')
                    .setDescription('The hour of the call (1am - 12am)')
                    .setRequired(true)
                    .addChoices(
                        {name: '1am', value: 1},
                        {name: '2am', value: 2},
                        {name: '3am', value: 3},
                        {name: '4am', value: 4},
                        {name: '5am', value: 5},
                        {name: '6am', value: 6},
                        {name: '7am', value: 7},
                        {name: '8am', value: 8},
                        {name: '9am', value: 9},
                        {name: '10am', value: 10},
                        {name: '11am', value: 11},
                        {name: '12am', value: 12},
                        {name: '1pm', value: 13},
                        {name: '2pm', value: 14},
                        {name: '3pm', value: 15},
                        {name: '4pm', value: 16},
                        {name: '5pm', value: 17},
                        {name: '6pm', value: 18},
                        {name: '7pm', value: 19},
                        {name: '8pm', value: 20},
                        {name: '9pm', value: 21},
                        {name: '10pm', value: 22},
                        {name: '11pm', value: 23},
                        {name: '12pm', value: 24},
                    )
                )
                .addStringOption(option =>
                    option
                    .setName('minute')
                    .setDescription('The minute of the call (0-59)')
                    .setRequired(true)
                )
            ),
    async execute(interaction, client) {
        if(file.get("callStartTime") === null) {
            return interaction.reply({content: `There is no call active.`, ephemeral: true});
        }

        if (interaction.options.getSubcommand() === 'auto') {
            const channelid = interaction.options.getString('channelid');
            const messageid = interaction.options.getString('messageid');

            var message;
            var channel;
            if(messageid != null) {
                if(channelid != null) {
                    channel = await client.channels.fetch(channelid);
                    message = await channel.messages.fetch(messageid);
                } else {
                    try{
                        message = await interaction.channel.messages.fetch(messageid);
                    } catch{
                        interaction.reply({content: `Could not find the message, try using the \`channelid\` field`, ephemeral: true})
                        return
                    }
                }
                file.set("callStartTime", Date.parse(message.createdAt));
                file.set("callDate", new Date(message.createdAt).toLocaleDateString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
                file.set("callTime", new Date(message.createdAt).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
                interaction.reply({content: `The call's time has been overriden to \`${message.createdAt}\``, ephemeral: true});
            }
        } else if(interaction.options.getSubcommand() === 'manual') {
            var month = interaction.options.getString('month');
            var day = interaction.options.getInteger('day');
            var year = interaction.options.getInteger('year');
            var hour = interaction.options.getInteger('hour');
            var minute = interaction.options.getString('minute');

            if(month == null) {
                month = 'Jan';
            }
            if(day == null) {
                day = 1;
            }
            if(year == null) {
                year = 2023;
            }
            if(hour == null) {
                hour = 1;
            }
            if(minute == null) {
                minute = "00";
            }

            var date = new Date(`${month} ${day} ${year} ${hour}:${minute}`)
            var currentDate = new Date()
        
            if(date > currentDate) {
                await interaction.reply({content: `That date is in the future!`, ephemeral: true})
                setTimeout(() => {
                    interaction.editReply({content: `Cancelled`, ephemeral: true})
                }, 1500)

                setTimeout(() => {
                    interaction.deleteReply()
                }, 5000)

                return
            }
            
            var now = new Date()
            
            if(date > now){
                console.log('invalid')
            }

            interaction.reply({content: `The call's time has been overriden to \`${date}\``, ephemeral: true});
            file.set("callStartTime", Date.parse(`${month} ${day} ${year} ${hour}:${minute}`));
            file.set("callDate", new Date(`${month} ${day} ${year} ${hour}:${minute}`).toLocaleDateString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
            file.set("callTime", new Date(`${month} ${day} ${year} ${hour}:${minute}`).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
        }  
    }
}
