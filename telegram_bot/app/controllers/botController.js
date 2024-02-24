const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const userService = require('../services/userService');
const cron = require('node-cron');
const axios = require('axios');


module.exports = {
    start: (bot) => {
        bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            await userService.handleStart(chatId, bot, msg);
        });
    },
    handleMessage: (bot) => {
        bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const message = msg.text;
            const user = await User.findOne({ chatId: chatId });


            if (!user) {
                await bot.sendMessage(chatId, 'Welcome! Please provide your name:');
                const user = new User({
                    chatId: chatId,
                });
                await user.save();
                return;
            }

            // Check if user's name is missing
            if (!user.name) {
                // Update user's name
                user.name = message;
                await user.save();
                await bot.sendMessage(chatId, 'Thanks! Now, please provide your city:');
                return;
            }

            // Check if user's city is missing
            if (!user.city) {
                // Update user's city
                user.city = message;
                await user.save();
                await bot.sendMessage(chatId, 'Got it! Finally, please provide your country:');
                return;
            }

            // Check if user's country is missing
            if (!user.country) {
                // Update user's country
                user.country = message;
                await user.save();
                await bot.sendMessage(chatId, 'Thank you! You\'re all set.');
                return;
            }
        });
    },
    handleWeatherUpdates: async (bot) => {
        const adminData = await Admin.findOne({});
        const API_KEY = adminData.weatherKey;
        cron.schedule(`0 */${adminData.frequency} * * *`, async () => {
            try {
                const users = await User.find({
                    blocked: false,
                });
                for (const user of users) {
                    if (user.city && user.country) {
                        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${user.city},${user.country}&aqi=no`);                    
                        await bot.sendMessage(user.chatId, `Weather update for ${user.city}, ${user.country}: ${response.data.current.temp_c}, ${response.data.current.condition.text}`);
                    }
                }
            } catch (error) {
                console.error('Error fetching weather updates:', error);
            }
        });
    }
};
