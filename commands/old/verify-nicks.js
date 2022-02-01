const verifyNicks = async(context) => {
    const { client, message, configuration, logChannel, database, args } = context;
    const { mainServerID, botLogsChannel } = configuration;
    const { guild, channel } = message;
    if(message.channel.name !== 'bot-ops') {
        return;
    }

    let mainGuild = await client.guilds.cache.find(g => g.id === mainServerID);
    let thisGuild = await client.guilds.cache.find(g => g.id === message.guild.id);
    let toProcess = await procNicks(mainGuild, thisGuild);
    for (let i = 0; i < toProcess.length; i++) {
        await sleep(1000);
        await procChange(toProcess[i], client, message);
    }

};

const procChange = (toProcess, client, message) => {
    let theMember = client.guilds.cache.find(g => g.id === message.guild.id)
        .members.cache.find(m => m.id === toProcess[3]);
    theMember.setNickname(toProcess[2]);
    message.channel.send('Updated ' + toProcess[0] + ' (' + toProcess[1] + ') to match main server: ' + toProcess[2]);
}

const procNicks = (mainGuild, thisGuild) => {
    let retArray = [];
    thisGuild.members.cache.forEach(mem => {
        let mainMember = mainGuild.members.cache.find(m => m.id === mem.id);
        if(mainMember) {
            if (mainMember.nickname && mem.manageable) {
                if (mainMember.nickname !== mem.nickname) {
                    let thisUsername = mem.user.username;
                    let thisNickname = ' ';
                    if (mem.nickname) {
                        thisNickname = mem.nickname;
                    }
                    let mainNickname = mainMember.nickname;
                    let memberID = mem.id;
                    let line = [];
                    line.push(thisUsername);
                    line.push(thisNickname);
                    line.push(mainNickname);
                    line.push(memberID);
                    retArray.push(line);
                }
            }
            let beecheck = mainMember.roles.cache.find(r => r.name === 'bee');
            if(!beecheck && !mem.user.bot && thisGuild.id === '797212905065938974') {
                let localLogChannel = mainMember.guild.channels.cache.find(c => c.name === 'bot-ops');
                if(mainMember.kickable) {
                    //mainMember.send('Thank you for your interest in Pantheon Industry Discord. Unfortunately you need to have roles in the main Panthoen Discord prior to joining the Industrial Discord. Once you are given roles in the Main Pantheon Discord, please feel free to come back over.');
                    //mainMember.kick('Does not have any roles');
                    localLogChannel.send(mainMember.user.username + ' does not have the bee role and was kicked');
                }
                else {
                    localLogChannel.send(mem.user.username + ' does not have the bee role and should be kicked');
                }
            }
        }
    });
    return retArray;
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
};

module.exports = verifyNicks;