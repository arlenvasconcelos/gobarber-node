import { request, Router } from 'express';
import { hash } from 'bcrypt';
import { getRepository } from 'typeorm';

import User from '../models/User';

import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const usersRepository = getRepository(User);
  const users = await usersRepository.find();

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();

    const hashedPassword = await hash(password, 8);

    const user = await createUserService.execute({
      name,
      email,
      password: hashedPassword,
    });

    return response.json(user);
  } catch (e) {
    return response.status(400).json({ message: e.message });
  }
});

usersRouter.patch('/avatar', ensureAuthenticated, async (request, response) => {
  return response.json({ ok: true });
});
export default usersRouter;
