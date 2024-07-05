import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const token = process.env.TELEGRAM_TOKEN || '7365123056:AAHe_pJkp6Yyrc1bS1HmqFA0toDp4bEJyf4';
const bot = new TelegramBot(token, { polling: true });

let currentCity = '';
let isInWeatherMenu = false;
let isInCurrencyMenu = false;

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    isInWeatherMenu = false;
    isInCurrencyMenu = false;
    sendMainMenu(chatId);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === 'Weather' && !isInWeatherMenu) {
        isInWeatherMenu = true;
        isInCurrencyMenu = false;
        bot.sendMessage(chatId, 'Please enter a city name to get weather information:', {
            reply_markup: {
                keyboard: [['Show weather every 3 hours', 'Show weather every 6 hours'], ['Back']],
                resize_keyboard: true
            }
        });
    } else if (text === 'Currency Exchange' && !isInCurrencyMenu) {
        isInWeatherMenu = false;
        isInCurrencyMenu = true;
        bot.sendMessage(chatId, 'Please choose a currency:', {
            reply_markup: {
                keyboard: [['USD', 'EUR'], ['Back']],
                resize_keyboard: true,
            }
        });
    } else if (text === 'Back') {
        isInWeatherMenu = false;
        isInCurrencyMenu = false;
        sendMainMenu(chatId);
    } else if (isInWeatherMenu) {
        await handleWeatherRequest(chatId, text);
    } else if (isInCurrencyMenu) {
        await handleCurrencyRequest(chatId, text);
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

async function handleWeatherRequest(chatId, cityName) {
    if (cityName === 'Show weather every 3 hours' || cityName === 'Show weather every 6 hours') return;

    currentCity = cityName;
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

        const weatherData = weatherResponse.data;
        const temperature = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;

        const message = `Current weather in ${cityName}: ${temperature}°C, ${weatherDescription}`;
        bot.sendMessage(chatId, message);

    } catch (error) {
        console.error('Error fetching weather:', error);
        if (error.response && error.response.status === 404) {
            bot.sendMessage(chatId, `City '${cityName}' not found. Please enter a valid city name.`);
        } else {
            bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again later.');
        }
    }
}

async function handleCurrencyRequest(chatId, currency) {
    if (currency === 'USD' || currency === 'EUR') {
        bot.sendMessage(chatId, `Fetching currency exchange rates for ${currency}...`);

        try {
            const currencyResponse = await axios.get('https://api.monobank.ua/bank/currency');
            const exchangeRates = currencyResponse.data;

            const currencyRate = exchangeRates.find((rate) => 
                (rate.currencyCodeA === 840 && currency === 'USD') || 
                (rate.currencyCodeA === 978 && currency === 'EUR')
            );

            if (currencyRate) {
                const buyRate = currencyRate.rateBuy;
                const sellRate = currencyRate.rateSell;
                const message = `Current exchange rates for ${currency}:\nBuy: ${buyRate}\nSell: ${sellRate}`;
                bot.sendMessage(chatId, message);
            } else {
                bot.sendMessage(chatId, `No exchange rate data available for ${currency}.`);
            }

        } catch (error) {
            console.error('Error fetching currency exchange rates:', error);
            bot.sendMessage(chatId, 'Failed to fetch currency exchange rates. Please try again later.');
        }
    } else {
        bot.sendMessage(chatId, 'Please choose a currency:', {
            reply_markup: {
                keyboard: [['USD', 'EUR'], ['Back']],
                resize_keyboard: true,
            }
        });
    }
}

function sendMainMenu(chatId) {
    bot.sendMessage(chatId, 'Please choose an option:', {
        reply_markup: {
            keyboard: [['Weather'], ['Currency Exchange']],
            resize_keyboard: true
        }
    });
}
