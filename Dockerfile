FROM docker.io/node:latest

ENV auditlogchannel=1078033482162372628
ENV callchannel=841700183220813904
ENV clientId=836801220692934706
ENV token=ODM2ODAxMjIwNjkyOTM0NzA2.GXbUl8._ZnQIKjBAC0xZoWY8Q6u5czpczNfdZ1RnTylp0

# Create the bot's directory

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot



COPY package.json /usr/src/bot

RUN npm install



COPY . /usr/src/bot



# Start the bot.

CMD ["npm", "start"]
