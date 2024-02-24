const User = require('../models/userModel');

module.exports = {
    handleStart: async (chatId, bot) => {
        try {
            const user = await User.findOne({ chatId: chatId });
            if (!user) {
                await bot.sendMessage(chatId, 'Welcome! Please provide your name:');
            } else {
                await bot.sendMessage(chatId, 'Welcome back!');
            }
        } catch (error) {
            console.error(error);
        }
    },
    handleMessage: async (chatId, message, bot) => {
        try {
        } catch (error) {
            console.error(error);
        }
    }
};
