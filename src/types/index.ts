export interface ILarekApi {
    baseUrl: string;
    cdnUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
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

export interface IUserData {
    payment: methodPay;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
    
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
    button: HTMLButtonElement;
    valid: boolean;
	errors: HTMLElement;
    reset(): void;
    validate(): boolean;
}

export  interface ISuccess {
    totalPrice: number;
}


export type TCardCatalog = Pick<ICard, "id" |  "image" | "title" | "category" | "price">;
export type TCardBasket = Pick<ICard, "title" | "price">;
export type TUserDataOneStep = Pick<IUserData, "payment" | "address">;
export type TUserDataTwoStep = Pick<IUserData, "email" | "phone">;
export type methodPay = "online" | "cash" | "";
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

