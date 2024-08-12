import { IUserData, methodPay } from "../types";
import { IEvents } from "./base/Events";

export class UserData implements IUserData {
    payment: methodPay;
    address: string;
    email: string;
    phone: string;
    events : IEvents;
    total: number;
    items: string[];

    constructor(events: IEvents) {
        this.events = events;
    }


    get MethodPay(): methodPay { 
        return this.payment;
    } 
    set MethodPay(value: methodPay) {
        this.payment = value;
    }
    get Adress(): string {
        return this.address;
    }
    set Adress(value: string) {
        this.address = value;
    }
    get Email(): string {
        return this.email;
    }
    set Email(value: string) {
        this.email = value;
    }
    get Phone(): string {
        return this.phone;
    }
    set Phone(value: string) {
        this.phone = value;
    }
}