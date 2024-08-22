import { EventsEnum } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModalData {
	content: HTMLElement;
}
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', () => this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	protected toggleModal(state: boolean = true) {
		this.toggleClass(this.container, 'modal_active', state);
	}
	protected handleEscape = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};

	open() {
		this.toggleModal(); 
		document.addEventListener('keydown', this.handleEscape);
		this.events.emit(EventsEnum.MODAL_OPEN);
	}

	close() {
		this.toggleModal(false); 
		document.removeEventListener('keydown', this.handleEscape);
		this.content = null;
		this.events.emit(EventsEnum.MODAL_CLOSE);
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
