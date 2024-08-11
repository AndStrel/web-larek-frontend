export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    
}

export interface IUserData {
    _methodPay: string;
    _adress: string;
    _email: string;
    _phone: string;
}

export interface ICardsData {
    _cards: ICard[];
    _preview: string | null;
    setCards(cards: ICard[]): void;
    setPreview(item: ICard): void;
    getCards(): ICard[];


}

export interface IBasketData {
    cardsBasket: ICard[] | null;
    totalPrice: number;
    counter: number;
    addCard(item: ICard): void;
    deleteCard(item: ICard): void;
    getCardIndex(item: ICard): number;
    clearBasket(): void;    
    get BasketCounter(): number;
    get BasketTotalPrice(): number;
}

export interface IPage {
    counter: number;
    cardsList: ICard[];
}

export  interface ISuccess {
    totalPrice: number;
}
export interface IForm {
    button: string;
    form: HTMLFormElement;
    inputs: HTMLInputElement[];
    errors: string[];
    reset(): void;
    validate(): boolean;
    submit(): void;
}

export type TCardCatalog = Pick<ICard, "id" |  "image" | "title" | "category" | "price">;
export type TCardBasket = Pick<ICard, "title" | "price">;
export type TUserDataOneStep = Pick<IUserData, "_methodPay" | "_adress">;
export type TUserDataTwoStep = Pick<IUserData, "_email" | "_phone">;
export type methodPay = "Оплата картой" | "Оплата наличными"
