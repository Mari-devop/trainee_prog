import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_TOKEN || '6464970218:AAHM2ZjdeUuVmMxvAT4R1uMYthptsi8Ciho';
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    console.log(`Message from ${msg.chat.username || msg.chat.title}: ${msg.text}`);
});

bot.onText(/\/?photo/, (msg) => {
    if (msg.chat.type === 'private') {
            const randomImageId = Math.floor(Math.random() * 1085); 
            const photoUrl = `https://picsum.photos/id/${randomImageId}/200/300`;

            bot.sendPhoto(msg.chat.id, photoUrl, {
                caption: "Here is your random photo!"
            });
    } else {
        bot.sendMessage(msg.chat.id, "Sorry, I can only send photos in private chats.");
    }
});
