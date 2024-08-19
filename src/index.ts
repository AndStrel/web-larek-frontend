import { EventEmitter } from './components/base/Events';
import { CardsData } from './components/CardsData';
import { Basket } from './components/Basket';
import { UserData } from './components/UserData';
import './scss/styles.scss';
import { ICard, IForm, ILarekApi, IUserData, methodPay } from './types';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { Api } from './components/base/Api';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
// import { testCards } from './utils/testData';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Order } from './components/Order';

const events = new EventEmitter();
const larekApi = new LarekApi(API_URL, CDN_URL);
const cardsData = new CardsData(events);
const userData = new UserData();
const page = new Page(document.querySelector('.gallery'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// слушатель всех событий выводящий в консоль название события и его данные
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// переменные контейнеров для шаблонов
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate(basketTemplate), events);

// контейнер для теста отображения карточек
// const testSection: HTMLElement = document.querySelector('.gallery');

// экземпляры карточек из темплейтов
// const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
// const cardCatalog = new Card(cloneTemplate(cardCatalogTemplate), events);
// const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);

// запрос карточек с сервера
larekApi
	.getCards()
	.then((items) => {
		cardsData.setCards(items);
	})
	.catch((error) => {
		console.log(error);
	});
// создает карточки из темплейтов и добавляет их в галерею на главной странице
events.on('cards:changed', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardConteiner = new Card(cloneTemplate(cardCatalogTemplate), events);
		return cardConteiner.render(card);
	});
	page.render({ gallery: cardsArray });
});

// Устанавливает ID карточки в превью модели и вызывает событие preview:changed.
events.on('card:selected', (item: ICard) => {
	cardsData.setPreview(item);
});
// Открытие превью
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), events);
	if (basket.cardsBasket.find((card) => card.id === item.id)) {
		card.buttonCard = 'Убрать из корзины';
	}
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			description: cardsData.getCardById(item.id).description,
			price: item.price,
			category: item.category,
		}),
	});
});
// Открытие корзины
events.on('basket:open', () => {
	modal.render({ content: basket.render() });
	basket.BasketCounter === 0 ? basket.clearBasket() : null;
});

// // Отправка карточки в корзину
events.on('card:buy', (item: Card) => {
	basket.toggleBasketCard(item);
});

// Удаление карточки из корзины
events.on('card:delete', (item: ICard) => {
	basket.deleteCard(item);
});

// Измененние данных в корзине
events.on('basket:changed', () => {
	page.counter = basket.BasketCounter;
	basket.cardsBasket.map(() => {
		const cardsArray = basket.cardsBasket.map((item) => {
			const newBasketCard = new Card(cloneTemplate(cardBasketTemplate), events);
			newBasketCard.index = basket.getCardIndex(item);
			return newBasketCard.render({
				title: item.title,
				price: item.price,
				id: item.id,
			});
		});
		basket.render({ cardsBasketList: cardsArray });
	});
});

// оформление заказа
events.on('order:open', () => {
	const order = new Order(cloneTemplate(orderTemplate), events);
	modal.render({ content: order.render() });
	basket.addCardsToOrder(userData);
	userData.total = Number(basket.BasketTotalPrice);
	order.setButtonView(userData.payment);

	// НАДО ДОПИСАТЬ ДЕЙСТВИЯ ВАЛИДАЦИИ
});

events.on(
	'order:changed',
	(data: { container: Order; payment: string}) => {
		data.payment === 'online'
			? (userData.payment = 'online')
			: (userData.payment = 'cash');
		data.container.disablePayment(userData);
	}
);

events.on('order:submit', () => {
		// userData.address = 
	const contacts  = new Order(cloneTemplate(contactsTemplate), events);
	modal.render({ content: contacts.render() });

});
	


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
	// userData.payment = ''; // Возможно не нужно
});
