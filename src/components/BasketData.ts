import { IBasketData, ICard } from "../types";
import { IEvents } from "./base/Events";

export class Basket implements IBasketData {
    cardsBasket: ICard[];
    totalPrice: number;
    counter: number;
    events: IEvents;

    // Конструктор принимает объект с событиями и инициализирует свойства
    constructor(events: IEvents) {
        this.cardsBasket = [];
        this.totalPrice = 0;
        this.counter = 0;
        this.events = events;
    }
    // Метод для добавления карты в корзину
    addCard(item: ICard) {
        this.cardsBasket.push(item);
        this.counter += 1;
        this.totalPrice += item.price;
        this.events.emit('basket:changed');
    }

    // Метод для удаления карты из корзины
    deleteCard(item: ICard) {
        this.cardsBasket.splice(this.cardsBasket.indexOf(item), 1);
        this.totalPrice -= item.price;
        this.counter -= 1;
        this.events.emit('basket:changed');
    }
    // Метод для получения индекса карты
    getCardIndex(item: ICard) {
		return Number(this.cardsBasket.indexOf(item)) + 1;
	}

    // Метод для очистки корзины
    clearBasket() {
		this.cardsBasket = [];
        this.totalPrice = 0;
        this.counter = 0;
		this.events.emit('basket:changed');
	}

    // Метод для получения количества карточек в корзине
    get BasketCounter() {
        return this.counter;
    }

    // Метод для получения общей стоимости карточек в корзине
    get BasketTotalPrice() {
        return this.totalPrice;
    }
}