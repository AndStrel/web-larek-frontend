import { ICard } from "../types/index";
export class Card implements ICard {
    id: string;
    description: string;    
    image: string;
    title: string;
    category: string;
    price: number | null;
}