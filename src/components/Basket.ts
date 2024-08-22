import { IBasket, EventsEnum } from '../types';
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
			this.events.emit(EventsEnum.ORDER_OPEN);
		});
	}
	// метод для отрисовки карт в корзине
	set basketList(items: HTMLElement[]) {
		this._basketList.replaceChildren(...items);
	}

	// Метод для отображения корзины при наличии карт
	fullCardBasket(num: number) {
		this.setSumPriceConteiner(num);
		this.setDisabled (this._basketButton, false); 
		this.setText (this._basketButton, 'Оформить заказ'); 
	}

	// Метод для изменения суммы в корзине
	setSumPriceConteiner(num: number) {
		this.setText (this._sumPriceConteiner, String(`${num} синапсов`));
	}

	// Метод для очистки корзины
	clearBasket() {
		this.setText (this._sumPriceConteiner, '0 синапсов');
		this._basketList.innerHTML = '';
		this.setDisabled (this._basketButton, true);
		this.setText (this._basketButton, 'Корзина пуста');
		this.events.emit(EventsEnum.BASKET_CHANGED);
	}
}
