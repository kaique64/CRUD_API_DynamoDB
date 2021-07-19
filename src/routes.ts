import { Router } from 'express';
import UserController from './controllers/UserController';

const route = Router();

route.post('/create', UserController.create);
route.get('/read/:user_id', UserController.read);
route.put('/update/:user_id', UserController.update);
route.delete('/delete/:user_id', UserController.delete);

export default route;
