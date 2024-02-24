const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

router.post('/setFrequency', async (req, res) => {
    await Admin.findOneAndUpdate({}, {
        frequency: req.body.frequency,
    }, {
        upsert: true
    });
    res.json({
        message: 'Frequency updated successfully',
    })
});
router.post('/setWeatherKey', async (req, res) => {
    await Admin.findOneAndUpdate({}, {
        weatherKey: req.body.weatherKey,
    });
    res.json({
        message: 'Weather key updated successfully',
    })
});
router.post('/setTelegramKey', async (req, res) => {
    await Admin.findOneAndUpdate({}, {
        telegramKey: req.body.telegramKey,
    });
    res.json({
        message: 'Telegram key updated successfully',
    })
});

router.post('/blockUser', async (req, res) => {
    await User.findOneAndUpdate({
        chatId: req.body.chatId,
    }, {
        blocked: true,
    });
    res.json({
        message: 'User blocked successfully',
    })
});

module.exports = router;