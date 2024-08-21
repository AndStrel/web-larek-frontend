import { IBasket } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Basket extends Component<IBasket> {
	protected _basketList: HTMLElement;
	protected _sumPriceConteiner: HTMLElement;
	protected _basketButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketList = this.container.querySelector('.basket__list');
		this._basketButton = this.container.querySelector('.basket__button');
		this._sumPriceConteiner = this.container.querySelector('.basket__price');

		this._basketButton.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}
	// метод для отрисовки карт в корзине
	set basketList(items: HTMLElement[]) {
		this._basketList.replaceChildren(...items);
	}

	// Метод для отображения корзины при наличии карт
	fullCardBasket(num: number) {
		this.setSumPriceConteiner(num);
		this._basketButton.disabled = false;
		this._basketButton.textContent = 'Оформить заказ';
	}

	// Метод для изменения суммы в корзине
	setSumPriceConteiner(num: number) {
		this._sumPriceConteiner.textContent = String(`${num} синапсов`);
	}

	// Метод для очистки корзины
	clearBasket() {
		this._sumPriceConteiner.textContent = '0 синапсов';
		this._basketList.innerHTML = '';
		this._basketButton.disabled = true;
		this._basketButton.textContent = 'Корзина пуста';
		this.events.emit('basket:changed');
	}
}
