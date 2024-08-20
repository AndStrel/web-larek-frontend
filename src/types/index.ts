export interface ILarekApi {
	baseUrl: string;
	cdnUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: TApiPostMethods): Promise<T>;
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
	getCards(): ICard[];
}

export interface IBasketData {
	totalPrice: number;
	counter: number;
	addCard(item: ICard): void;
	deleteCard(item: ICard): void;
	getCardIndex(item: ICard): number;
	clearBasket(): void;
	get BasketCounter(): number;
	get BasketTotalPrice(): number;
}

export interface IOrderData {
	order: {};
	errors: FormErrors;
}

export interface IPage {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}

export interface IBasket {
	cardsList: HTMLElement[];
	cardsBasketList: HTMLElement[];
	locked: boolean;
}

export interface IForm {
	valid: boolean;
	errors: string[];
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
	clearForm(): void;
}

export type TCardCatalog = Pick<
	ICard,
	'id' | 'image' | 'title' | 'category' | 'price'
>;
export type TCardBasket = Pick<ICard, 'title' | 'price'>;
export type TOrderDataOneStep = Pick<IOrder, 'payment' | 'address'>;
export type TOrderDataTwoStep = Pick<IOrder, 'email' | 'phone'>;
export type TOrderField = TOrderDataOneStep & TOrderDataTwoStep;
export type TmethodPay = 'online' | 'cash' | '';
export type TApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type FormErrors = Partial<Record<keyof IOrder, string>>;
