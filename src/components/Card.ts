import { ICard } from '../types/index';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

// interface ICardActions {
//     onClick: (event: MouseEvent) => void;
// }

export class Card extends Component<ICard> {
	protected _id: string;
	protected _description?: HTMLElement;
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected _buttonCard: HTMLButtonElement;
	// protected _cardGallery: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;
		this._description = container.querySelector(`.card__text`);
		this._image = container.querySelector(`.card__image`);
		this._title = container.querySelector(`.card__title`);
		this._category = container.querySelector(`.card__category`);
		this._price = container.querySelector(`.card__price`);
		this._buttonCard = container.querySelector(`.card__button-buy`);
		// this._cardGallery = container.querySelector(`.gallery__item`);

		// устанавливаем слушатель на кнопку купить и при нажатии вызываем событие card:buy
		// иначе устанавливаем слушатель на карточку и при нажатии вызываем событие card:selected
		if (this._buttonCard) {
			if (this._buttonCard) {
				this._buttonCard.addEventListener('click', () => {
					this.events.emit('card:buy', { card: this });
				});
			} else {
				container.addEventListener('click', () => {
					this.events.emit('card:selected', { card: this });
				});
			}
		}
	}

	set id(value: string) {
		this._id = value;
	}
	get id(): string {
		return this._id;
	}
	set title(value: string) {
		this.setText(this._title, value);
	}
	get title(): string {
		return this._title.textContent;
	}
	set description(value: string) {
		this.setText(this._description, value);
	}
	get description(): string {
		return this._description.textContent;
	}
	set image(value: string) {
		this.setImage(this._image, value, this._title.textContent);
	}
	set category(value: string) {
		this.setText(this._category, value);
	}
	get category(): string {
		return this._category.textContent;
	}

	set price(value: number) {
		if (value === null) {
			this._price.textContent = 'Бесценно';
			this.setDisabled(this._buttonCard, true);
		} else if (value === 0) {
			this._price.textContent = 'Тебе не продается';
			this.setDisabled(this._buttonCard, true);
		} else {
			this._price.textContent = String(`${value} синапсов`);
			this.setDisabled(this._buttonCard, false);
		}
	}
	get price(): number {
		return Number(this._price.textContent);
	}
}
