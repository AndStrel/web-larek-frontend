import { EventsEnum, ICard, IOrder } from '../types';
import { IEvents } from './base/Events';
import { Card } from './Card';

export class BasketData {
	protected _counter: number;
	protected _sumPrice: number;
	protected _cardsBasket: ICard[] = [];

	constructor(protected events: IEvents) {
		this.events = events;
		this._counter = 0;
		this._sumPrice = 0;
	}
	// метод для добавления массива карт в корзину
	set cardsBasket(items: ICard[]) {
		this._cardsBasket = items;
		this.events.emit(EventsEnum.BASKET_CHANGED);
	}
	// метод для получения карт в корзине
	get cardsBasket(): ICard[] {
		return this._cardsBasket;
	}

	// Метод для записи значения количества карточек в корзине
	set basketCounter(value: number) {
		this._counter = value;
	}
	// Метод для получения значения количества карточек в корзине
	get basketCounter(): number {
		return this._counter;
	}
	// Метод для получения общей стоимости карточек в корзине
	get sumPrice(): number {
		return this._sumPrice;
	}

	// Метод для добавления карты в корзину
	addCard(item: ICard) {
		this._cardsBasket = [...this._cardsBasket, item];
		this._counter += 1;
		this._sumPrice += item.price;
		this.events.emit(EventsEnum.BASKET_CHANGED, this);
	}

	// Метод для удаления карты из корзины
	deleteCard(item: ICard) {
		this._cardsBasket.splice(
			this._cardsBasket.findIndex((card) => card.id === item.id),
			1
		);
		this._sumPrice > 0 ? (this._sumPrice -= item.price) : null;
		this._counter > 0 ? (this._counter -= 1) : null;
		this.events.emit(EventsEnum.BASKET_CHANGED, this);
	}

	// Метод для переключения состояния кнопки в корзине и добавления/удаления из корзины
	toggleBasketCard(item: Card) {
		if (this._cardsBasket.some((card) => card.id === item.id)) {
			this.deleteCard(item);
			item.buttonCard = 'В корзину';
		} else {
			this.addCard(item);
			item.buttonCard = 'Убрать из корзины';
		}
	}

	// Метод для получения индекса карты
	getCardIndex(item: ICard) {
		return Number(this._cardsBasket.indexOf(item)) + 1;
	}

	// Метод для очистки данных корзины
	clearBasket() {
		this._cardsBasket = [];
		this._counter = 0;
		this._sumPrice = 0;
	}

	// передача карт находящихся в корзине в заказ
	addCardsToOrder(arr: IOrder) {
		arr.items = this.cardsBasket.map((card) => card.id);
	}
}
