const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const botController = require('./controllers/botController');
const adminController = require('./controllers/adminController');
const Admin = require('./models/adminModel');

let adminData;
(async function init() {
    mongoose.connect('mongodb://localhost:27017/telegram_bot_db', { useNewUrlParser: true, useUnifiedTopology: true });
    const adminExist = await Admin.findOne();
    if (!adminExist) {
        adminData = new Admin({
            frequency: 24,
            weatherKey: '6697caba2e92405ebe584147242402',
            telegramKey: '7057656861:AAEw4ILHH74aViwKNA2mbNskOigv5n2GLPQ',
        });
        await adminData.save();
        app.use(express.json());
        
        const bot = new TelegramBot(adminData.telegramKey, { polling: true });
        
        botController.start(bot);
        botController.handleMessage(bot);
        botController.handleWeatherUpdates(bot);
    }
})();


app.use('/admin', adminController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


