import { IBasket, IBasketData, ICard } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { Card } from './Card';
import { UserData } from './UserData';

export class Basket extends Component<IBasket> {
	protected _cardsBasketList: HTMLElement;
	protected _sumPriceConteiner: HTMLElement;
	protected _counter: number;
	protected _basketButton: HTMLButtonElement;
	protected _sumPrice: number;
	protected _cardsBasket: ICard[] = [];

	// Конструктор принимает объект с событиями и инициализирует свойства
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._cardsBasketList = this.container.querySelector('.basket__list');
		this._cardsBasket = [];
		this._counter = 0;
		this._basketButton = this.container.querySelector('.basket__button');
		this._sumPrice = 0;
		this._sumPriceConteiner = this.container.querySelector('.basket__price');

		this._basketButton.addEventListener('click', () => {
			this.events.emit('order:open');

		});
	}
	//метод для отрисовки карт в корзине
	set cardsBasketList(items: HTMLElement[]) {
		this._cardsBasketList.replaceChildren(...items);
	}

	set cardsBasket(items: ICard[]) {
		this._cardsBasket = items;
		this.events.emit('basket:changed');
	}
	// метод для получения карт в корзине
	get cardsBasket(): ICard[] {
		return this._cardsBasket;
	}
	// Метод для получения количества карточек в корзине
	get BasketCounter(): number {
		return this._counter;
	}
	set BasketCounter(value: number) {
		this._counter = value;
	}

	// Метод для получения общей стоимости карточек в корзине
	get BasketTotalPrice(): number {
		return this._sumPrice;
	}

	// Метод для добавления карты в корзину
	addCard(item: ICard) {
		this._cardsBasket.push(item);
		this._counter += 1;
		this._sumPrice += item.price;
		this._sumPriceConteiner.textContent = String(`${this._sumPrice} синапсов`);
		this._basketButton.disabled = false;
		this._basketButton.textContent = 'Оформить заказ';
		this.events.emit('basket:changed', this);
	}

	// Метод для удаления карты из корзины
	deleteCard(item: ICard) {
		this._cardsBasket.splice(
			this._cardsBasket.findIndex((card) => card.id === item.id),
			1
		);
		this._sumPrice > 0 ? (this._sumPrice -= item.price) : null;
		this._sumPriceConteiner.textContent = String(`${this._sumPrice} синапсов`);
		this._counter > 0 ? (this._counter -= 1) : null;
		this._counter === 0 ? this.clearBasket() : null;
		this.events.emit('basket:changed', this);
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

	// Метод для очистки корзины
	clearBasket() {
		this._cardsBasket = [];
		this._cardsBasketList.innerHTML = '';
		this._basketButton.disabled = true;
		this._basketButton.textContent = 'Корзина пуста';
		this.events.emit('basket:changed');
	}

	addCardsToOrder<T extends UserData> (arr: T) {
		this.cardsBasket.forEach((item) => {
			if (!arr.items.includes(item.id)) {
				arr.items.push(item.id);
			}
		});
	}
}
