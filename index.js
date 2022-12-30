const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '5908938693:AAEC3lXqCkhx7qnVt6Pnrm5lmFmsR5OFNTk';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
	await bot.sendMessage(
		chatId,
		'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!'
	);
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	console.log(chats[chatId]);
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};

const start = () => {
	bot.setMyCommands([
		{
			command: '/start',
			description: 'Начальное приветствие',
		},
		{
			command: '/info',
			description: 'Получить информацию о пользователе',
		},
		{
			command: '/game',
			description: 'Сыграть в игру по угадыванию цифры',
		},
	]);

	bot.on('message', async (msg) => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			await bot.sendMessage(
				chatId,
				'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/7.jpg'
			);
			return bot.sendMessage(
				chatId,
				`Добро пожаловать в телеграм бот сервиса по прохождению собеседований - One-To-One!`
			);
		}

		if (text === '/info') {
			return bot.sendMessage(
				chatId,
				`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
			);
		}
		if (text === '/game') {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
	});

	bot.on('polling_error', (err) => {
		console.log(err);
	});

	bot.on('callback_query', async (msg) => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === '/again') {
			return startGame(chatId);
		}
		if (data == chats[chatId]) {
			return bot.sendMessage(
				chatId,
				`Ты выбрал цифру ${data} и победил!`,
				againOptions
			);
		} else {
			return bot.sendMessage(
				chatId,
				`К сожалению ты не угадал! Бот загадал цифру ${chats[chatId]}`,
				againOptions
			);
		}
	});
};

start();
