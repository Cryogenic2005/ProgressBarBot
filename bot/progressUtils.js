const PROGRESS_BAR_DEFAULT_LENGTH = 20;
const PROGRESS_FILLED_CHAR = '█';
const PROGRESS_EMPTY_CHAR = '░';

/**
 * Create a progress bar
 * @param {number} progress - The current progress
 * @param {number} required - The required progress to complete
 * @param {number} length - The length of the progress bar
 * @returns {string} The progress bar
 */
function createProgressBar(progress, required, length = PROGRESS_BAR_DEFAULT_LENGTH) {
    const percent = Math.min(progress / required, 1);
    const progressLength = Math.round(length * percent);
    const emptyLength = length - progressLength;
    return PROGRESS_FILLED_CHAR.repeat(progressLength) + PROGRESS_EMPTY_CHAR.repeat(emptyLength);
}

/**
 * Create a progress bar message
 * @param {string} name - The name of the progress bar
 * @param {number} progress - The current progress
 * @param {number} required - The required progress to complete
 * @param {number} length - The length of the progress bar
 * @returns {string} The progress bar message
 */
function createProgressBarMessage(name, progress, required, length = PROGRESS_BAR_DEFAULT_LENGTH) {
    let message = `**${name}**\n`;
    message += `Status: ${progress}/${required}\n`;
    message += `Progress: ${createProgressBar(progress, required, length)}`
    message += ` (${Math.round(progress / required * 100)}%)`;
    if (progress >= required) {
        message += '\nCompleted!';
    }
    return message;
}

/**
 * Get the progress from a message
 * @param {string} message - The message
 * @returns {{name: string, progress: number, required: number, length: number}} The progress bar's data
 */
function getProgress(message) {
    const name = message.match(/\*\*(.*)\*\*/)[1];
    const progress = parseInt(message.match(/Status: (\d+)/)[1], 10);
    const required = parseInt(message.match(/Status: \d+\/(\d+)/)[1], 10);
    const length = message.match(/Progress: (.*)/)[1].length;

    return { name, progress, required, length };
}

module.exports = {
    createProgressBarMessage,
    getProgress
};