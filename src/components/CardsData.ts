import { ICard, ICardsData } from "../types";
import { IEvents } from "./base/Events";

export class CardsData implements ICardsData {
    cards: ICard[];
    preview: string | null;
    events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
        
    }

// Метод для установки коллекции карточек
    setCards(cards: ICard[]) {
        this.cards = cards;
        this.events.emit('cards:changed');
    }

// Метод для установки карточки в превью 
    setPreview(item: ICard) {
        this.preview = item.id;
        this.events.emit('preview:changed', item);
    }

// Метод для получения карточки по id
    getCardById(id: string) {
        return this.cards.find(card => card.id === id);
    }
}