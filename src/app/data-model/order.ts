export interface Order {
    products: any[];
    _id: string;
    stockistName: string;
    stockistId: string;
    date: string;
    status: OrderStatus;
}

// const OrderStatus = Object.freeze({Placed: 1, Confirmed: 2, Delivered: 3, Cancelled: 4});

export enum OrderStatus {
    Placed = 1,
    Confirmed = 2,
    Delivered = 3,
    Cancelled = 4
}
