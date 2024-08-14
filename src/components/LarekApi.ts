import { ICard, ILarekApi, IUserData } from '../types';
import { CDN_URL } from '../utils/constants';
import { Api, ApiListResponse } from './base/Api';

// класс для работы с API
export class LarekApi extends Api implements ILarekApi {
	// экземпляр класса
	// private _api: ILarekApi;

	// конструктор для работы с API который принимает экземпляр класса для работы с API
	constructor(baseUrl: string, cdnUrl: string, options?: RequestInit) {
		super(baseUrl, cdnUrl, options);

	}

	// методы для работы с API
	// запрос карточки с сервера по id
	getCard(id: string): Promise<ICard> {
		return this.get(`/product/${id}`)
		.then((item: ICard) => ({
				...item,
				image: this.cdnUrl + item.image,
			}))
	
	}


	// запрос массива карточек с сервера
	getCards(): Promise<ICard[]> {
		return this.get(`/product`)
		.then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdnUrl + item.image,
			}))
		);
	}
	// отправка данных о заказе вводимых пользователем
	postUserData(order: IUserData): Promise<IUserData> {
		return this.post<IUserData>('/order', order).then(
			(data: IUserData) => data
		);
	}
}
