import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CardsData } from './components/CardsData';
import { Basket } from './components/Basket';
import { OrderData } from './components/OrderData';
import { ICard, IOrder, TOrderField, EventsEnum, TmethodPay } from './types';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Order, OrderContact } from './components/Order';
import { Success } from './components/common/Success';
import { BasketData } from './components/BasketData';

const events = new EventEmitter();
const larekApi = new LarekApi(API_URL, CDN_URL);
const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);
const page = new Page(ensureElement<HTMLElement>('.gallery'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// шаблоны для контейнеров
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
		console.error(`${error}.
		Не ну тут надо разбираться.`);
	});

// создает карточки из темплейтов и добавляет их в галерею на главной странице
events.on(EventsEnum.CARDS_CHANGE, () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardConteiner = new Card(cloneTemplate(cardCatalogTemplate), events);
		return cardConteiner.render(card);
	});
	page.render({ gallery: cardsArray });
});

// Устанавливает ID карточки в превью модели и вызывает событие preview:changed.
events.on(EventsEnum.CARDS_SELECT, (item: ICard) => {
	cardsData.setPreview(item);
});

// Открытие превью карточки
events.on(EventsEnum.PREVIEW_CHANGE, (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), events);
	if (basketData.cardsBasket.find((card) => card.id === item.id)) {
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

// Отправка карточки в корзину
events.on(EventsEnum.CARD_BUY, (item: Card) => {
	basketData.toggleBasketCard(item);
	basket.fullCardBasket(basketData.sumPrice);
});

// Удаление карточки из корзины
events.on(EventsEnum.CARD_DELETE, (item: ICard) => {
	basketData.deleteCard(item);
	basketData.basketCounter === 0 ? basket.clearBasket() : null;
});

// Открытие корзины
events.on(EventsEnum.BASKET_OPEN, () => {
	modal.render({ content: basket.render() });
	basketData.basketCounter === 0 ? basket.clearBasket() : null;
});

// Измененние данных в корзине
events.on(EventsEnum.BASKET_CHANGED, () => {
	page.counter = basketData.basketCounter;
	basket.setSumPriceConteiner(basketData.sumPrice);
	basketData.cardsBasket.map(() => {
		const cardsArray = basketData.cardsBasket.map((item) => {
			const newBasketCard = new Card(cloneTemplate(cardBasketTemplate), events);
			newBasketCard.index = basketData.getCardIndex(item);
			return newBasketCard.render({
				title: item.title,
				price: item.price,
				id: item.id,
			});
		});
		basket.render({ basketList: cardsArray });
	});
});

// оформление заказа
events.on(EventsEnum.ORDER_OPEN, () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
	basketData.addCardsToOrder(orderData.getOrder());
	orderData.setTotal(Number(basketData.sumPrice));
	order.enablePaymentFocus(orderData.getPayment());
	orderData.validateOrder();
});

// при изменении способа оплаты отрисовывает актуальные данные которые записаны в orderData
events.on(
	EventsEnum.ORDER_CHANGED,
	(data: { container: Order; payment: TmethodPay }) => {
		orderData.togglePayment(data.payment);
		data.container.enablePaymentFocus(orderData.getPayment());
		data.container.disablePaymentFocus(orderData);
		orderData.validateOrder();
	}
);

// при изменении полей ввода передает данные в order
events.on(
	/\.*\..*:change/,
	(data: { field: keyof TOrderField; value: TmethodPay }) => {
		orderData.setOrderField(data.field, data.value);
		if (data.field === 'email') {
			orderData.validateEmail(data.value);
		}
		if (data.field === 'phone') {
			orderData.validatePhone(data.value);
		}
	}
);

// при получении данных валидации отрисовывает ошибки
events.on(EventsEnum.ERRORS_CHANGE, (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});
// при нажатии на кнопку Оформить заказ открывает форму для ввода контактных данных
events.on(EventsEnum.ORDER_SUBMIT, () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// при нажатии на кнопку "Оформить заказ" отправляет данные на сервер и после получения ответа отрисовывает сообщение об успешной отправке и очищает корзину
events.on(EventsEnum.CONTACTS_SUBMIT, () => {
	larekApi
		.postOrderData(orderData.getOrder())
		.then((data) => {
			success.setTotal(Number(data.total));
			modal.render({
				content: success.render(),
			});
			basketData.clearBasket();
			basket.clearBasket();
			orderData.clearOrder();
			order.clearInputs();
			contacts.clearInputs();
		})
		.catch((err) => {
			console.error(`${err}.
		Попробуйте ещё раз или обратитесь в поддержку.`);
		});
});

// обновляем страницу после нажатия кнопки "За новыми покупками!"
events.on(EventsEnum.ORDER_SUCCESS, () => {
	modal.close();
});

// Блокируем прокрутку страницы если открыта модалка
events.on(EventsEnum.MODAL_OPEN, () => {
	page.wrapper = true;
});

// ... и разблокируем
events.on(EventsEnum.MODAL_CLOSE, () => {
	page.wrapper = false;
});
