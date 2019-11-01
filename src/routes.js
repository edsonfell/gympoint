import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollController from './app/controllers/EnrollController';
import authMiddleware from './app/middlewares/AuthMiddleware';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Students routes
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

// Plans routes
routes.get('/plans/', PlanController.index);
routes.post('/plans/', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Enrolls routes
routes.get('/enrolls/', EnrollController.index);
routes.post('/enrolls/', EnrollController.store);
routes.put('/enrolls/:student_id', EnrollController.update);
routes.delete('/enrolls/:id', EnrollController.delete);

export default routes;
