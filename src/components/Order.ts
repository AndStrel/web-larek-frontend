import {
	IForm,
	TmethodPay,
	TOrderDataOneStep,
	TOrderDataTwoStep,
} from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { Form } from './common/Form';
import { OrderData } from './OrderData';

export class Order extends Form<TOrderDataOneStep> {
	protected _buttonOnline: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	protected _formAddress: HTMLInputElement;
	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._buttonOnline = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._buttonCash = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this._formAddress = container.elements.namedItem(
			'adress'
		) as HTMLInputElement;

		if (this._buttonOnline) {
			this._buttonOnline.addEventListener('click', () => {
				this.toggleClass(this._buttonOnline, 'button_alt-active');
				this.events.emit('order:changed', {
					container: this,
					payment: 'online',
				});
			});
		}
		if (this._buttonCash) {
			this._buttonCash.addEventListener('click', () => {
				this.toggleClass(this._buttonCash, 'button_alt-active');
				this.events.emit('order:changed', { container: this, payment: 'cash' });
			});
		}
	}

	// проверяет способ записанный в данных и при его наличсии выделяет актуальный, при его отсутствии обнуляет выделение
	enablePaymentFocus(value: string) {
		if (value === 'cash') {
			this.toggleClass(this._buttonCash, 'button_alt-active', true);
			this.toggleClass(this._buttonOnline, 'button_alt-active', false);
		} else {
			this._buttonCash.classList.remove('button_alt-active');
			this._buttonOnline.classList.remove('button_alt-active');
		}
	}

	// при изменении способа оплаты снимает выделение с ранее выбранного способа
	disablePaymentFocus(item: OrderData) {
		if (item.getPayment().includes('cash')) {
			this._buttonOnline.classList.remove('button_alt-active');
		} else {
			this._buttonCash.classList.remove('button_alt-active');
		}
	}
}

export class OrderContact extends Form<TOrderDataTwoStep> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = container.elements.namedItem('email') as HTMLInputElement;
		this._phone = container.elements.namedItem('phone') as HTMLInputElement;
	}
}
