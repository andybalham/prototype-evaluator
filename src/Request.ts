import { Application } from './Application';
import { Product } from './Product';

export class Request {
    application: Application;
    products: Product[];
}