import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/AuthMiddleware';

const routes = new Router();
// Decidi trabalhar com middlewares individuais
// e chama-los onde for necessário, assim fica
// mais fácil de organizar o arquivo de rotas

// Rotas sessions
routes.post('/sessions', SessionController.store);

// Rotas users
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware.defaultAuth, UserController.update);

// Rotas students
routes.post('/students', authMiddleware.defaultAuth, StudentController.store);
routes.put(
  '/students/:id',
  authMiddleware.defaultAuth,
  StudentController.update
);

export default routes;
