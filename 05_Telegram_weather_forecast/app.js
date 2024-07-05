import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const token = process.env.TELEGRAM_TOKEN || '7365123056:AAHe_pJkp6Yyrc1bS1HmqFA0toDp4bEJyf4';
const bot = new TelegramBot(token, { polling: true });

let currentCity = '';

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Weather Bot! Please enter a city name to get weather information:');
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const cityName = msg.text;

    if (cityName.startsWith('/')) return;

    if (cityName === 'Show weather every 3 hours' || cityName === 'Show weather every 6 hours') return;

    bot.sendMessage(chatId, `Fetching weather for ${cityName}...`);

    try {
        const encodedCityName = encodeURIComponent(cityName);
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: encodedCityName,
                appid: '8d468a741ede28d9248e0f584944d831',
                units: 'metric'
            }
        });

        currentCity = cityName;
        const weatherData = weatherResponse.data;
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;

        const message = `Current weather in ${cityName}: ${temperature}°C, ${weatherDescription}`;
        bot.sendMessage(chatId, message);

        bot.sendMessage(chatId, 'How often do you want to see weather updates?', {
            reply_markup: {
                keyboard: [['Show weather every 3 hours'], ['Show weather every 6 hours']],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });

    } catch (error) {
        console.error('Error fetching weather:', error);
        if (error.response && error.response.status === 404) {
            bot.sendMessage(chatId, `City '${cityName}' not found. Please enter a valid city name.`);
        } else {
            bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again later.');
        }
    }
});

bot.onText(/Show weather every (3|6) hours/, async (msg, match) => {
    const intervalHours = parseInt(match[1]);
    const chatId = msg.chat.id;
    if (!currentCity) {
        bot.sendMessage(chatId, 'Please enter a city name first.');
        return;
    }
    bot.sendMessage(chatId, `Fetching weather every ${intervalHours} hours for ${currentCity}...`);

    try {
        const weatherForecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                q: encodeURIComponent(currentCity),
                appid: '8d468a741ede28d9248e0f584944d831',
                units: 'metric'
            }
        });

        const forecasts = weatherForecastResponse.data.list;
        
        const filteredForecasts = forecasts.filter((forecast, index) => index % (intervalHours / 3) === 0);

        const groupedForecasts = filteredForecasts.reduce((acc, forecast) => {
            const date = new Date(forecast.dt_txt);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const formattedDate = `${day} ${month}`;
            const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            const temperature = forecast.main.temp;
            const weatherDescription = forecast.weather[0].description;
            const feelsLike = forecast.main.feels_like;
            const forecastMessage = `   ${time}: ${temperature}°C, feels like: ${feelsLike} ${weatherDescription}`;
            
            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(forecastMessage);
            return acc;
        }, {});

        const message = Object.keys(groupedForecasts).map(date => {
            return `${date}:\n${groupedForecasts[date].join('\n')}`;
        }).join('\n\n');

        bot.sendMessage(chatId, message);

    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        bot.sendMessage(chatId, 'Failed to fetch weather forecast. Please make sure you have set a city and try again.');
    }
});


