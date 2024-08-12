import { ICard, ILarekApi, IUserData } from "../types";


export class LarekApi {
    private _api: ILarekApi;

    constructor(api: ILarekApi) {
        this._api = api;
    }

    getCard(id: string): Promise<ICard> {
        return this._api.get<ICard>(`/product/${id}`).then((card: ICard) => card);
    }

    getCards(): Promise<ICard[]> {
        return this._api.get<ICard[]>('/product').then((cards: ICard[]) => cards);
    }

    postUserData(order: IUserData): Promise<IUserData> {
        return this._api.post<IUserData>('/order', order).then((data: IUserData) => data);
    }

}

    

