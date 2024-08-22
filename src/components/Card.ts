import { EventsEnum, ICard } from '../types/index';
import { categories } from '../utils/constants';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Card extends Component<ICard> {
	protected _id: string;
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _buttonCard: HTMLButtonElement;
	protected _buttonDelete: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;
		this._description = container.querySelector(`.card__text`);
		this._image = container.querySelector(`.card__image`);
		this._title = container.querySelector(`.card__title`);
		this._category = container.querySelector(`.card__category`);
		this._price = container.querySelector(`.card__price`);
		this._buttonCard = container.querySelector(`.card__button-buy`);
		this._buttonDelete = container.querySelector(`.basket__item-delete`);
		this._index = this.container.querySelector(`.basket__item-index`);

		if (this._buttonCard) {
			this._buttonCard.addEventListener('click', () => {
				this.events.emit(EventsEnum.CARD_BUY, this);
			});
		} else if (this._buttonDelete) {
			this._buttonDelete.addEventListener('click', () => {
				this.events.emit(EventsEnum.CARD_DELETE, this);
			});
		} else {
			this.container.addEventListener('click', () => {
				this.events.emit(EventsEnum.CARDS_SELECT, this);
			});
		}
	}

	set id(value: string) {
		this._id = value;
	}
	get id(): string {
		return this._id || '';
	}
	set title(value: string) {
		this.setText(this._title, value);
	}
	get title(): string {
		return this._title.textContent || '';
	}
	set description(value: string) {
		this.setText(this._description, value);
	}
	get description(): string {
		return this._description.textContent || '';
	}
	set image(value: string) {
		this.setImage(this._image, value, this._title.textContent);
	}
	get image(): string {
		return this._image.src || '';
	}
	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categories.get(value), true);
	}
	get category(): string {
		return this._category.textContent || '';
	}

	set price(value: number) {
		if (value === null) {
			this.setText (this._price, 'Бесценно');
			this.toggleButton();
		} else if (value === 0) {
			this.setText (this._price, 'Товара нет в наличии'); 
			this.toggleButton();
		} else {
			this.setText (this._price, String(`${value} синапсов`)); 
			this.toggleButton(false);
		}
	}



	get price(): number {
		if (this._price.textContent === 'Бесценно') {
			return null;
		}
		return parseInt(this._price.textContent);
	}

	set buttonCard(value: string) {
		this.setText(this._buttonCard, value);
	}

	get buttonCard(): string {
		return this._buttonCard.textContent;
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}

	get index(): number {
		return parseInt(this._index.textContent);
	}

	protected toggleButton (state: boolean = true) {
		this.setDisabled(this._buttonCard, state);
	}
}
