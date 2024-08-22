import {
	EventsEnum,
	FormErrors,
	IOrder,
	TmethodPay,
	TOrderField,
} from '../types';
import { IEvents } from './base/Events';

export class OrderData {
	protected order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	protected errors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.events = events;
	}
	// записывает в массив карточек id выбранных карточек
	setItems(id: string) {
		this.order.items.push(id);
	}

	// устанавливает сумму заказа
	setTotal(value: number) {
		this.order.total = value;
	}

	// устанавливает способ оплаты
	setPayment(value: TmethodPay) {
		this.order.payment = value;
	}

	// очищает способ оплаты
	clearPayment() {
		this.order.payment = '';
	}

	// переключает способ оплаты
	togglePayment(value: TmethodPay) {
		if (this.order.payment === value) {
			this.clearPayment();
		} else {
			this.setPayment(value);
		}
	}

	// возвращает способ оплаты
	getPayment() {
		return this.order.payment;
	}
	//передает название поля и значение которое ввел пользователь
	setOrderField(field: keyof TOrderField, value: TmethodPay) {
		this.order[field] = value;
		this.validateOrder();
	}
	// валидирует форму
	validateOrder() {
		const errors: typeof this.errors = {};

		if (!this.order.address) {
			errors.address = `Необходимо указать адрес`;
		}
		if (!this.order.payment) {
			errors.payment = `Необходимо указать способ оплаты`;
		}
		this.errors = errors;
		this.events.emit(EventsEnum.ERRORS_CHANGE, this.errors);
		return Object.keys(errors).length === 0;
	}

	// валидирует почту
	validateEmail(value: string) {
		const errors: typeof this.errors = {};
		const _validateEmail = () => {
			const re =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(value).toLowerCase());
		};
		if (!_validateEmail()) {
			errors.email = `Неверный формат почты`;
		}
		if (this.order.email.length === 0) {
			errors.email = `Необходимо указать почту`;
		}
		this.errors.email = errors.email;
		this.events.emit(EventsEnum.ERRORS_CHANGE, this.errors);
	}
	// валидирует телефон
	validatePhone(value: string) {
		const errors: typeof this.errors = {};
		const _validatePhone = () => {
			const re = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
			return re.test(String(value).toLowerCase());
		};
		if (!_validatePhone()) {
			errors.phone = `Неверный формат телефона`;
		}
		if (this.order.phone.length === 0) {
			errors.phone = `Необходимо указать номер телефона`;
		}
		this.errors.phone = errors.phone;
		this.events.emit(EventsEnum.ERRORS_CHANGE, this.errors);
	}

	// возвращает данные заказа
	getOrder() {
		return this.order;
	}
	// очищает данные заказа
	clearOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
		this.events.emit(EventsEnum.MODAL_CLOSE);
	}
}
