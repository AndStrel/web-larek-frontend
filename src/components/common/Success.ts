import { ISuccess } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Success extends Component<ISuccess> {
	protected total: number;
	protected description: HTMLElement;
	protected bayButton: HTMLElement;
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.bayButton = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		this.bayButton.addEventListener('click', () => {
				this.events.emit('success:finished');
		});
	}
	setTotal(value: number) {
		this.total = value;
		this.description.textContent = `Списано ${this.total} синапсов`;
	}

//    close() {
//         this.container.classList.remove('order-success_active');
//         this.events.emit('success:close');
//     }
}
