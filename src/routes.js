import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollController from './app/controllers/EnrollController';
import authMiddleware from './app/middlewares/AuthMiddleware';
import CheckinController from './app/controllers/CheckinController';
import StudentHelpOrderController from './app/controllers/StudentHelpOrderController';
import AdminsHelpOrderController from './app/controllers/AdminsHelpOrderController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Checkins routes
routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

// Student's help orders
routes.post(
  '/students/:student_id/help-orders',
  StudentHelpOrderController.store
);
routes.get(
  '/students/:student_id/help-orders',
  StudentHelpOrderController.index
);

routes.use(authMiddleware);

// Admin's help orders management
routes.get('/help-orders/', AdminsHelpOrderController.index);
routes.post('/help-orders/:id/answer', AdminsHelpOrderController.store);

// Student's routes
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

// Plan's routes
routes.get('/plans/', PlanController.index);
routes.post('/plans/', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Enroll's routes
routes.get('/enrolls/', EnrollController.index);
routes.post('/enrolls/', EnrollController.store);
routes.put('/enrolls/:student_id', EnrollController.update);
routes.delete('/enrolls/:id', EnrollController.delete);

export default routes;
