import { IBasketData, ICard } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/Events";
import { OrderData } from "./OrderData";



export class BasketData extends Component<IBasketData>{
    protected _counter: number
    protected _sumPrice: number;
    protected _cardsBasket: ICard[] = [];

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = 0;
        this._sumPrice = 0;
    }

    set cardsBasket(items: ICard[]) {
		this._cardsBasket = items;
		this.events.emit('basket:changed');
	}
	// метод для получения карт в корзине
	get cardsBasket(): ICard[] {
		return this._cardsBasket;
	}

    	// Метод для получения количества карточек в корзине
	get BasketCounter(): number {
		return this._counter;
	}
	set BasketCounter(value: number) {
		this._counter = value;
	}

    	// Метод для получения общей стоимости карточек в корзине
	get BasketTotalPrice(): number {
		return this._sumPrice;
	}


    
    // передача карт находящихся в корзине в заказ
    addCardsToOrder<T extends OrderData> (arr: T) {
		this.cardsBasket.forEach((item) => {
			if (!arr.getItems().includes(item.id)) {
				arr.setItems(item.id);
			}
		});
	}


}

