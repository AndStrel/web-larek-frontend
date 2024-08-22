import { IPage, EventsEnum } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');

		this._basket.addEventListener('click', () => {
			this.events.emit(EventsEnum.BASKET_OPEN);
		});
	}
	// Метод для изменения счетчика корзины на главной странице
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}
	// Метод для отрисовки галлереи на главной странице
	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}
	//Метод для установки блокировки страницы
	set wrapper(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked');
	}
}
