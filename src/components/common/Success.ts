import { EventsEnum, ISuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Success extends Component<ISuccess> {
	protected total: number;
	protected description: HTMLElement;
	protected byeButton: HTMLElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.byeButton = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		this.byeButton.addEventListener('click', () => {
			this.events.emit(EventsEnum.ORDER_SUCCESS);
		});
	}
	// установка общего количества синапсов
	setTotal(value: number) {
		this.total = value;
		this.setText (this.description, `Списано ${this.total} синапсов`);
	}
}
