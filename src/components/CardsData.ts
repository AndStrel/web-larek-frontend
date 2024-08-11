import { ICard, ICardsData } from "../types";
import { IEvents } from "./base/Events";

// Класс CardsData создает массив карточек, устанавливает значение превью в котором хранится id карточки и управляет событиями
export class CardsData implements ICardsData {
    _cards: ICard[];
    _preview: string | null;
    events: IEvents;

// Конструктор принимает объект с событиями
    constructor (events: IEvents) {
        this.events = events;
    }

// Метод для установки коллекции карточек
    setCards(cards: ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed');
    }
    

// Метод для установки превью карточки
    setPreview(item: ICard) {
        this._preview = item.id;
        this.events.emit('preview:changed');
    }

// Метод для получения коллекции карточек
    getCards() {
        return this._cards;
    }

}