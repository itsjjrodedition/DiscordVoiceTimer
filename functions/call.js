const { EmbedBuilder, ChannelType, ActivityType } = require('discord.js');
require('dotenv').config();

const editJsonFile = require("edit-json-file");

const wait = require('util').promisify(setTimeout);

async function execute(client){

    var call = false;
    var justCalled = true;
    var justEnded = false;
    var callTime;
    var callDate;
    var callStartTime;
    var callmsg;
    var timeOccurred = 0;
    var callFile;

    var hours;
    var minutes;
    var seconds;
    
    const guilds = client.guilds.cache.map(guild => guild.id)

    setInterval(async() => {

        callFile = editJsonFile(`${process.cwd()}/call.json`, {
            autosave: true
        });

        settingsFile = editJsonFile(`${process.cwd()}/settings.json`, {
            autosave: true
        });
        
		var count = 0;
		const voiceChannels = client.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
		for(const[id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
		if(count > 0){
			call = true;
            justEnded = true;
		} else {

			call = false;
			client.user.setPresence({ activities: [{ name: ` `, type: ActivityType.Custom }], status: 'dnd', });
            justCalled = true;
            if(justEnded === true){

                for(const guild of guilds){
                    const cached = client.guilds.cache.get(guild)
                    cached.members.cache.get(client.user.id).setNickname(`📞 ${count} in call`)
                }

                callFile.empty();

                const callEndEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle("Call ended")
                    .setDescription(`Call ended at ${new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")} on ${new Date().toLocaleDateString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}`)
                    .addFields(
                        { name: 'Call lasted', value: `${hours}:${minutes}:${seconds}`, inline: true },
                    )
                    .setFooter({ text:  "hh:mm:ss" })
                    .setTimestamp()
                callmsg.edit({ embeds: [callEndEmbed] })
                justEnded = false;
                justCalled = true;
            }
		}
        if(call === true && justCalled === true){

	    for(const guild of guilds){
                const cached = client.guilds.cache.get(guild)
                cached.members.cache.get(client.user.id).setNickname(`📞 ${count} in call`)
	    }

            callDate = new Date().toLocaleDateString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
            callTime = new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
            callStartTime = Date.now();

            callFile.set("callStartTime", callStartTime)
            callFile.set("callDate", callDate)
            callFile.set("callTime", callTime)

            const callStartEmbed = new EmbedBuilder()
                .setTitle("Call started")
                .setDescription(`Call started at ${callTime} on ${callDate}`)
                .setColor(0x00FF00)
                .setTimestamp()
            callmsg = await client.channels.cache.get(process.env.callchannel).send({ embeds: [callStartEmbed] });
            justCalled = false
            timeOccurred = 10;

            wait(5000);
        } else if(call === true && justCalled === false){

            for(const guild of guilds){
                const cached = client.guilds.cache.get(guild)
                cached.members.cache.get(client.user.id).setNickname(`📞 ${count} in call`)
            }

            callStartTime = callFile.get("callStartTime");
            callDate = callFile.get("callDate");
            callTime = callFile.get("callTime");
            
            var totalSeconds = (Date.now() - callStartTime) / 1000;
            if(totalSeconds < 0) totalSeconds = 0;
            var totalMinutes = totalSeconds / 60;
            var totalHours = totalMinutes / 60;

            hours = Math.floor(totalHours).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            minutes = Math.floor(totalMinutes % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
            seconds = Math.floor(totalSeconds % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

            client.user.setPresence({ activities: [{ name: `${hours}:${minutes}:${seconds}`, type: ActivityType.Playing }], status: 'online', });
            const callOngoingEmbed = new EmbedBuilder()
                .setTitle("Call ongoing")
                .setColor(0x00FF00)
                .setTimestamp()
                .addFields(
                    { name: 'Time elapsed', value: `${hours}:${minutes}:${seconds}`, inline: true },
                    { name: '-------------', value: 'hh:mm:ss', inline: true },
                    { name: 'Call started at', value: `${callTime} on ${callDate}`, inline: true },
                )
                .setFooter({ text:  "Updates every 10 seconds", iconURL: client.user.avatarURL()})
                
                if(timeOccurred < 10){
                    timeOccurred +=  5;
                }
                
                if(callmsg && timeOccurred === 10){
                    callmsg.edit({ embeds: [callOngoingEmbed] });
                    timeOccurred = 0;
                }
        }

	}, 5000);
}

module.exports = {  execute  }
