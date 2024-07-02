#!/usr/bin/env node

import TelegramBot from 'node-telegram-bot-api';
import { program } from 'commander';
import fs from 'fs';

const token = process.env.TELEGRAM_TOKEN || '6464970218:AAHM2ZjdeUuVmMxvAT4R1uMYthptsi8Ciho';
const bot = new TelegramBot(token, { polling: true });


const chatId = 205913929; 

program
    .command('m <text>')
    .description('Send a message to a chat')
    .action((text) => {
        bot.sendMessage(chatId, text).then(() => {
            process.exit();
        }).catch((error) => {
            console.error('Error:', error);
            process.exit(1);
        });
    });

program
    .command('p <path>')
    .description('Send a photo to a chat')
    .action((path) => {
        try {
            const photo = fs.readFileSync(path);
            bot.sendPhoto(chatId, photo, {
                caption: "Here's your photo!"
            }).then(() => {
                process.exit();
            }).catch((error) => {
                console.error('Error:', error);
                process.exit(1);
            });
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    });

program.parse(process.argv);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(chatId, 'Welcome to the console sender bot! Use commands like /m <text> or /p <path> to interact.')
    .catch((error) => {
        console.error('Error:', error);
    });
});
