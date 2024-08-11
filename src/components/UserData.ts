import { IUserData, methodPay } from "../types";
import { IEvents } from "./base/Events";

export class UserData implements IUserData {
    _methodPay: methodPay;
    _adress: string;
    _email: string;
    _phone: string;
    _events : IEvents;
    constructor(events: IEvents) {
        this._events = events;
    }

    get MethodPay(): methodPay { 
        return this._methodPay;
    } 
    set MethodPay(value: methodPay) {
        this._methodPay = value;
    }
    get Adress(): string {
        return this._adress;
    }
    set Adress(value: string) {
        this._adress = value;
    }
    get Email(): string {
        return this._email;
    }
    set Email(value: string) {
        this._email = value;
    }
    get Phone(): string {
        return this._phone;
    }
    set Phone(value: string) {
        this._phone = value;
    }
}