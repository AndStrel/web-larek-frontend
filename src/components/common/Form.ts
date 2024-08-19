import { IForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<IForm> {
	protected _button: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _valid: boolean;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this.events = events;
		this._button = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`, this);
		});

		// if (this._button) {
		// 	this._button.addEventListener('click', (evt) => {
		// 		evt.preventDefault();
		// 		this.events.emit(`${this._button}:submit`, this);
		// 	});
		// }
	}

	set valid(value: boolean) {
		this._button.classList.toggle('button_disabled', !value);
		this._button.disabled = !value;

	}
	validate() {
		// 	this._valid = true;
		// 	this._inputs.forEach((input) => {
		// 		if (!input.checkValidity()) {
		// 			this._valid = false;
		// 			this._errors.push(input.validationMessage);
		// 		}
		// 	});
	}
}
