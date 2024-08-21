import { ICard, ILarekApi, IOrder } from '../types';
import { Api, ApiListResponse } from './base/Api';

export class LarekApi extends Api implements ILarekApi {
	// конструктор для работы с API который принимает экземпляр класса для работы с API
	constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
		super(baseUrl, cdnUrl, options);
	}

	// запрос карточки с сервера по id
	getCard(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((item: ICard) => ({
			...item,
			image: this.cdnUrl + item.image,
		}));
	}

	// запрос массива карточек с сервера
	getCards(): Promise<ICard[]> {
		return this.get(`/product`).then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdnUrl + item.image,
			}))
		);
	}
	// отправка данных о заказе вводимых пользователем
	postOrderData(order: IOrder): Promise<IOrder> {
		return this.post<IOrder>('/order', order).then((data: IOrder) => data);
	}
}
