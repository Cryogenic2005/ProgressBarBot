const { createProgressBarMessage, getProgress } = require('./progressUtils');

/**
 * Handle the help command
 * @param {Message} message - The message 
 */
function handleHelpFunction(message) {
    message.channel.send('Commands:\n' +
        '- **/create <name> <required_amount> [length]**\n' +
        '==> Create a progress bar, default length is 20\n' +
        '- **/update <message> <progress>**\n' +
        '==> Update a progress bar, must reply to the progress bar message\n');
}

/**
 * Handle the create command
 * @param {Message} message - The message
 * @param {string[]} args - The arguments
 */
function handleCreateFunction(message, args) {
    const name = args.shift();
    if (!name) {
        message.channel.send('Error: Name is required.');
        return;
    }

    const required = parseInt(args.shift());
    if (isNaN(required) || required <= 0) {
        message.channel.send('Error: Required amount must be a positive number.');
        return;
    }

    const progress = 0;

    let progressBar = createProgressBarMessage(name, progress, required);
    if(args.length > 0) {
        const length = parseInt(args.shift());
        if (isNaN(length) || length <= 0) {
            message.channel.send('Error: Length must be a positive number.');
            return;
        }
        progressBar = createProgressBarMessage(name, progress, required, length);
        return;
    }

    message.channel.send(progressBar);
}

/**
 * Handle the update command
 * @param {Message} message - The message
 * @param {string[]} args - The arguments
 * @param {string} client_id - The client ID 
 */
function handleUpdateFunction(message, args, client_id) {
    // Get the progress change
    const change = parseInt(args.shift());
    if (isNaN(change)) {
        message.channel.send('Error: Progress must be a number.');
        return;
    }

    message.channel.messages.fetch(message.reference.messageId)
        .then((reply) => {
            // Check if the message is a progress bar from this bot
            if (reply.author.id !== client_id) {
                message.channel.send('Error: You must reply to an existing progress bar message.');
                return;
            }

            // Get the progress data
            updateProgressBar(reply);
        })
        .catch((error) => {
            message.channel.send('Error: Could not fetch the message.');
            console.error('Error:', error);
        });

    function updateProgressBar(reply) {
        const progressData = getProgress(reply.content);
        progressData.progress = Math.max(0, Math.min(progressData.progress + change, progressData.required));

        // Create the new progress bar
        const newProgressBar = createProgressBarMessage(progressData.name, progressData.progress, progressData.required, progressData.length);

        // Edit the progress bar
        reply.edit(newProgressBar)
            .catch((error) => {
                message.channel.send('Error: Could not update the progress bar.');
                console.error('Error:', error);
            });
    }
}

module.exports = {
    handleHelpFunction,
    handleCreateFunction,
    handleUpdateFunction
};
