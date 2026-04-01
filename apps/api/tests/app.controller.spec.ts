import { AppController } from '../src/app/app.controller';
import { AppService } from '../src/app/app.service';

describe('AppController', () => {
    const appService = new AppService();
    const appController = new AppController(appService);

    it('should return hello message', () => {
        expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
});
