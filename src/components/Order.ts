import { IForm, methodPay } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { Form } from './common/Form';
import { UserData } from './UserData';

export class Order extends Form<IForm> {
	protected _buttonOnline: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	protected _formAdress: HTMLInputElement;
	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._buttonOnline = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._buttonCash = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this._formAdress = container.elements.namedItem(
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

		// Слушает поле ввода адреса
		// if (this._formAdress) {
		//     this._formAdress.addEventListener('input', () => {
		//         this.events.emit('order:adress')
		//         console.log(this._formAdress.value);
		//     });
		// }
	}

	
	setButtonView (value: methodPay) {
		if (value === 'cash') {
			this._buttonCash.classList.add('button_alt-active');
			this._buttonOnline.classList.remove('button_alt-active');
		} else if (value === 'online') {
			this._buttonCash.classList.remove('button_alt-active');
			this._buttonOnline.classList.add('button_alt-active');
		} else {
			this._buttonCash.classList.remove('button_alt-active');
			this._buttonOnline.classList.remove('button_alt-active');
		}
	}

	disablePayment(item: UserData) {
		if (item.payment.includes('cash')) {
			this._buttonOnline.classList.remove('button_alt-active');
		} else {
			this._buttonCash.classList.remove('button_alt-active');
		}
	}
}

// написать метод очистки формы при закрытии или сабмите
