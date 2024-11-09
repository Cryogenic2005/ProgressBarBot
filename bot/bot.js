require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleHelpFunction, handleCreateFunction, handleUpdateFunction } = require('./botFunctionHandlers');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
]});

client.on('messageCreate', (message) => {
    if (!message.mentions.has(client.user)) return;

    const args = message.content.split(' ');
    
    // Check if the first argument is not a direct mention to the bot
    if (args[0] !== `<@${client.user.id}>`){
        // Check if the bot was mentioned in @everyone or @here
        if (args[0] === `@everyone` || args[0] === `@here`) return;
    }
    else {
        args.shift();
    }

    // Check if the bot was mentioned without any command
    if (args.length === 0) {
        message.channel.send('Hello! I am a progress bar bot. Please use /help for more information regarding my commands.');
        return;
    }

    const command = args.shift().toLowerCase();

    // Check if the command is valid
    if (command.charAt(0) !== '/') {
        message.channel.send('Hello! I am a progress bar bot. Please use /help for more information regarding my commands.');
        return;
    }

    switch (command) {
        case '/help':
            handleHelpFunction(message);
            break;
        case '/create':
            if (args.length < 2) {
                message.channel.send('Usage: /create <name> <required_amount> [length]');
                return;
            }
            
            handleCreateFunction(message, args);
            break;
        case '/update':
            // Check if the message is a reply
            if (!message.reference) {
                message.channel.send('Error: You must reply to an existing progress bar message.');
                return;
            }

            // Check if the message has the required arguments
            if (args.length < 1) {
                message.channel.send('Usage: /update <progress> (Reply to a progress bar message)');
                return;
            }

            handleUpdateFunction(message, args, client.user.id);
            break;
        default:
            message.channel.send('Error: Unknown command. Please use /help for more information regarding my commands.');
            break;
        }
});

client.login(process.env.BOT_TOKEN);