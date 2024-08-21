export interface ILarekApi {
	baseUrl: string;
	cdnUrl: string;
	getCard(id: string): Promise<ICard>;
	getCards(): Promise<ICard[]>;
	postOrderData(order: IOrder): Promise<IOrder>;
}

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICardsData {
	cards: ICard[];
	preview: string | null;
	setCards(cards: ICard[]): void;
	setPreview(item: ICard): void;
	getCardById(id: string): ICard;
}

export interface IBasketData {
	counter: number;
	sumPrice: number;
	cardsBasket: ICard[];
	addCard(item: ICard): void;
	deleteCard(item: ICard): void;
	toggleBasketCard(item: ICard): number;
	getCardIndex(): void;
	clearBasket(): void;
	addCardsToOrder(): void;
}

export interface IOrderData {
	order: {};
	errors: {};
	setItems(id: string): void;
	setTotal(value: number): void;
	setPayment(value: TmethodPay): void;
	getPayment(): TmethodPay;
	setOrderField(field: keyof TOrderField, value: string): void;
	validateOrder(): void;
	getOrder(): IOrder;
	clearOrder(): void;
}

export interface IPage {
	counter: number;
	gallery: HTMLElement[];
	wrapper: HTMLElement;
	basket: HTMLElement;
}

export interface IBasket {
	basketList: HTMLElement[];
	sumPriceConteiner: HTMLElement;
	basketButton: HTMLButtonElement;
	fullCardBasket(num: number): void;
	setSumPriceConteiner(num: number): void;
	clearBasket(): void;
}

export interface IForm {
	valid: boolean;
	errors: string[];
	clearInputs(): void;
	render(): HTMLElement;
}

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}
export interface ISuccess {
	total: number;
	setTotal(): void;
}

export type TOrderDataOneStep = Pick<IOrder, 'payment' | 'address'>;
export type TOrderDataTwoStep = Pick<IOrder, 'email' | 'phone'>;
export type TOrderField = TOrderDataOneStep & TOrderDataTwoStep;
export type TmethodPay = 'online' | 'cash' | '';
export type TApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type FormErrors = Partial<Record<keyof IOrder, string>>;
