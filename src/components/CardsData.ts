import { ICard, ICardsData } from "../types";
import { IEvents } from "./base/Events";

// Класс CardsData создает массив карточек, устанавливает значение превью в котором хранится id карточки и управляет событиями
export class CardsData implements ICardsData {
    cards: ICard[];
    preview: string | null;
    events: IEvents;

// Конструктор принимает объект с событиями
    constructor (events: IEvents) {
        this.events = events;
        
    }

// Метод для установки коллекции карточек
    setCards(cards: ICard[]) {
        this.cards = cards;
        this.events.emit('cards:changed');
    }

// Метод для установки превью карточки
    setPreview(item: ICard) {
        this.preview = item.id;
        this.events.emit('preview:changed', item);
    }

// Метод для получения коллекции карточек
    getCards() {
        return this.cards
    }

    getCardById(id: string) {
        return this.cards.find(card => card.id === id);
    }
}