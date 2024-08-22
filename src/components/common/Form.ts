import { IForm } from '../../types';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<IForm> {
	protected _button: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _valid: boolean;
	protected _inputs: HTMLInputElement[];

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this._button = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this._inputs = ensureAllElements<HTMLInputElement>(
			'.form__input',
			this.container
		);

		this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`, this);
		});

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
	}

	// вызывается при изменении полей ввода и передает название поля и значение которое ввел пользователь
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}
	// очищает поля ввода
	clearInputs() {
		this._inputs.forEach((input) => {
			input.value = '';
		});
	}
	// меняет кнопку в зависимости от состояния валидации
	set valid(value: boolean) {
		this.setDisabled(this._button, !value);
	}
	//  меняет сообщение об ошибках
	set errors(value: string) {
		this.setText(this._errors, value);
	}
	// отрисовывает форму с учетом состояния валидации
	render(state: Partial<T> & Partial<IForm>) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
