import { EventEmitter } from './components/base/Events';
import { CardsData } from './components/CardsData';
import { Basket } from './components/Basket';
import { UserData } from './components/UserData';
import './scss/styles.scss';
import { ICard, ILarekApi, IUserData } from './types';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { Api } from './components/base/Api';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { testCards } from './utils/testData';
import { Page } from './components/Page';

const events = new EventEmitter();

// const _api: ILarekApi = new Api(API_URL, CDN_URL, settings);
const larekApi = new LarekApi(API_URL, CDN_URL);

const cardsData = new CardsData(events);
const userData = new UserData(events);
const basket = new Basket(events);
const cardsConteiner = new Page(
	document.querySelector('.gallery'),
	events
);
// слушатель всех событий выводящий в консоль название события и его данные
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// запрос карточек с сервера
larekApi
	.getCards()
	.then((items) => {
		// записываем полученный массив данных в cardsData
		cardsData.setCards(items);
	})
	.then(() => {
		// устанавливаем первую карточку в  превью для теста
		// testSection.append(cardPreview.render(cardsData.cards[1]));
	})
	.catch((error) => {
		console.log(error);
	});

// переменные контейнеров для шаблонов
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// контейнер для теста отображения карточек
const testSection: HTMLElement = document.querySelector('.gallery');

// экземпляры карточек из темплейтов
const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
const cardCatalog = new Card(cloneTemplate(cardCatalogTemplate), events);
const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);

// testSection.append(cardCatalog.render(testCards[3]));

// cardCatalog.render({title: 'вар',  price: 1124235234});

// const cardCatalog2 = new Card(cloneTemplate(cardCatalogTemplate), events);
// const cardCatalog3 = new Card(cloneTemplate(cardCatalogTemplate), events);
// const cardArray = [];

// cardArray.push(cardCatalog.render(testCards[0]));
// cardArray.push(cardCatalog2.render(testCards[1]));
// cardArray.push(cardCatalog3.render(testCards[2]));

// cardsConteiner.render({gallery:cardArray})

// слушатель события cards:changed? при срабатывании отрисовывает карточки в каталоге
events.on('cards:changed', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardConteiner = new Card(cloneTemplate(cardCatalogTemplate), events);
		return cardConteiner.render(card);
	});
	cardsConteiner.render({gallery: cardsArray});
});

// Выбор карточки как превью
events.on('card:selected', (item: ICard) => {
	cardsData.setPreview(item);
});

// Выбор карточки как элемент превью
// events.on('card:selected', (item: ICard) => {
// 	cardsData.setPreview(item);
// });
