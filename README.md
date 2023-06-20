# DiscordVoiceTimer

Welcome to the **Discord Voice Timer Bot** github! Below you can read more about the bot, like what it does, and how to set it up!

## Initial Set up

1. Head to [Discord Developer Portal](https://discord.com/developers/applications)
2. Sign into your discord account
3. If not already, go to the _**Applications**_ tab at the top left
4. Click the _**New Application**_ button
5. Enter a name for your bot
6. Copy the **Application ID** you will need this later...
7. Goto the _**Bot**_ section
8. Click the _**Add Bot**_ button
9. Click the _**Reset Token**_ button then _**Copy Token**_ button you will need this later...
10. Scroll down throw the toggle switches and turn on the following:
   - Presence Intent
   - Server Members Intent
11. Add bot to server 
    - Goto _**OAuth2**_ tab
    - Click the dropdown box for _**Default Authorization Link**_
    - Click the _**bot**_ checkbox
    - Save your changes
    - Goto _**URL Generator**_ section of _**OAuth2**_
    - Click the _**bot**_ checkbox once again
    - Copy the generated link at the bottom of the page
    - Paste link into browser and follow prompts to add to desired server (Must be an administrator or an owner of the server)

## Downloading and starting

1. Goto [Releases](https://github.com/J-dotjs/DiscordVoiceTimer/releases) then download the version of your choice
2. Head to the folder you downloaded the bot to
3. Open the the [sample.env](/sample.env) file
4. Fill out the fields, the *token* field is the token you copied from step 9 in the initial setup **REQUIRED**, the `auditlogchannel` is the ID of the channel you want call audits to be sent to, `callchannel` field is the ID of the channel where you want the details of the active call to go, and the `client_id` field is the application ID you copied from step 6 during the initial setup
5. Rename and change the file type of `sample.env` to just `.env`
6. Run the [start.bat](/start.bat) file to start your bot!

## Commands

### Slash commands:

Helpful if the bot disconnects, crashes, etc during call duration and users would want to reset it back:

#### `/override auto` 
> Uses the timestamp from the message given from the *messageid* field and uses that as the start time of the call.

#### `/override manual` 
> The user of the command defines the MM/DD/YYYY HH:MM of the call.

Utility:
#### `/joincall`
> The bot joins the call that the user that runs the command is in

#### `/leavecall`
> Has the bot leave the call that it's in

Settings:

#### `/settings nickname`
> Defines whether or not the bot should say the nickname of users in the call log

### Context Menu commands:

#### `Use message timestamp` 
> [Context Menu](https://kifopl.github.io/kifo-clanker/docs/guides/contextmenus) command that makes it easy to run the [/override auto](https://github.com/J-dotjs/DiscordVoiceTimer/tree/main#override-auto) command.

### TODO
- [x] Add the ability to turn off putting the nickname in call log channels
- [ ] Add the ability to allow users to give permission for the bot to message them in the call log
- [x] Have the bot join and leave the call
- [ ] Add the functionality to have the bot stay in the call that it's in for a certain amount of time
- [x] Remove ability to set the call to beyond current date
- [ ] Check for the date field of the manual command to not be above or below the range of the month selected (ex. if the `month` is April the date cannot be out of the range 1-30, if the `month` is February it cannot be out of the range 1-28 / 1-29 if its a leap year.)

### Long term TODOs
- [ ] Add an .exe file for easy usage instead of batch file
- [ ] Support for back end running (remove command prompt box)
