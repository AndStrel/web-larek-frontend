import {
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

	setItems(id: string) {
		this.order.items.push(id);
	}
	getItems(): string[] {
		return this.order.items;
	}

	setTotal(value: number) {
		this.order.total = value;
	}
	getTotal(): number {
		return this.order.total;
	}
	setPayment(value: TmethodPay) {
		this.order.payment = value;
	}
	getPayment() {
		return this.order.payment;
	}

	setOrderField(field: keyof TOrderField, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}

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

    getOrder() {
        return this.order;
    }

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
