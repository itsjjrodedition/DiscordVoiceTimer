FROM docker.io/node:latest

ENV auditlogchannel=1078033482162372628
ENV callchannel=841700183220813904
ENV clientId=836801220692934706
ENV token=

# Create the bot's directory

RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot



COPY package.json /usr/src/bot

RUN npm install



COPY . /usr/src/bot



# Start the bot.

CMD ["npm", "start"]
