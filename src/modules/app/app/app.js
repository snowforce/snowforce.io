import { LightningElement } from 'lwc';
import { createRouter } from '@lwrjs/router/my-config-file';

export default class MyApp extends LightningElement {
    router = createRouter();
}