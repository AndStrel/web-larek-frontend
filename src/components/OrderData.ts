import { FormErrors, IOrder, TmethodPay, TOrderField } from '../types';
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

	// возвращает способ оплаты
	getPayment() {
		return this.order.payment;
	}
	//передает название поля и значение которое ввел пользователь
	setOrderField(field: keyof TOrderField, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}
	// валидирует форму
	validateOrder() {
		const errors: typeof this.errors = {};
		if (!this.order.email) {
			errors.email = `Необходимо указать почту`;
		}
		if (!this.order.phone) {
			errors.phone = `Необходимо указать номер телефона`;
		}
		if (!this.order.address) {
			errors.address = `Необходимо указать адрес`;
		}
		if (!this.order.payment) {
			errors.payment = `Необходимо указать способ оплаты`;
		}
		this.errors = errors;
		this.events.emit('formErrors:change', this.errors);
		return Object.keys(errors).length === 0;
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
		this.events.emit('modal:close');
	}
}
