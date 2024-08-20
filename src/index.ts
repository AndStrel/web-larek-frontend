import { EventEmitter } from './components/base/Events';
import { CardsData } from './components/CardsData';
import { Basket } from './components/Basket';
import { OrderData } from './components/OrderData';
import './scss/styles.scss';
import {
	ICard,


	IOrder,


	TOrderField,
} from './types';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL} from './utils/constants';

import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Order, OrderContact } from './components/Order';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const larekApi = new LarekApi(API_URL, CDN_URL);
const cardsData = new CardsData(events);
const orderData = new OrderData(events);
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
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new OrderContact(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

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

// Открытие превью карточки
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
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
	basket.addCardsToOrder(orderData);
	orderData.setTotal(Number(basket.BasketTotalPrice));
	order.enablePaymentFocus(orderData.getPayment());
});

// при изменении способа оплаты отрисовывает актуальные данные которые записаны в orderData
events.on('order:changed', (data: { container: Order; payment: string }) => {
	data.payment === 'online'
		? orderData.setPayment('online')
		: orderData.setPayment('cash');
	data.container.disablePaymentFocus(orderData);
	orderData.validateOrder();
});

// при изменении полей ввода передает данные в order
events.on(
	/\.*\..*:change/,
	(data: { field: keyof TOrderField; value: string }) => {
		orderData.setOrderField(data.field, data.value);
		console.log(orderData);
	}
);

// при нажатии на кнопку Оформить заказ открывает форму для ввода контактных данных
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// при получении данных валидации отрисовывает ошибки
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	console.log(order.valid);
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// при нажатии на кнопку "Оформить заказ" отправляет данные на сервер и после получения ответа отрисовывает сообщение об успешной отправке и очищает корзину
events.on('contacts:submit', () => {
	basket.clearBasket();
	larekApi
		.postOrderData(orderData.getOrder())
		.then((data) => {
			success.setTotal(Number(data.total));

			modal.render({
				content: success.render(),
			});
		})
		.catch((err) => {
			console.error(`Ошибка при заказе ${err}.
		Попробуйте ещё раз или обратитесь в поддержку.`);
		});
});

// обновляем страницу после нажатия кнопки "За новыми покупками!"
events.on('success:finished', () => {
	document.location.reload();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
	order.clearInputs();
	contacts.clearInputs();
	// orderData.payment = ''; // Возможно не нужно
});
