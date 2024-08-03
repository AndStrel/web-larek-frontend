export interface ICard {
    id: string;
    description: string;
    image: string;
    tittle: string;
    category: string;
    price: number | null;
    
}

export interface IFormData {
    methodPay: string;
    adress: string;
    email: string;
    phone: string;
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
    getCard(id: string): ICard;
}

export interface IBasket {
    cardsBasket: ICard[] | null;
    totalPrice: number;
    counter: number;
    addCard(card: ICard): void;
    deleteCard(id: string): void;
}

export interface IPage {
    counter: number;
    cardsList: ICard[];
}

export  interface ISuccess {
    totalPrice: number;
}

export type TCardCatalog = Pick<ICard, "id" |  "image" | "tittle" | "category" | "price">;
export type TCardBasket = Pick<ICard, "tittle" | "price">;
export type TUserDataOneStep = Pick<IFormData, "methodPay" | "adress">;
export type TUserDataTwoStep = Pick<IFormData, "email" | "phone">;

