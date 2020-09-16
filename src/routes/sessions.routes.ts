import { Router } from 'express';
import {} from 'bcrypt';
import { getRepository } from 'typeorm';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const authenticateUser = new AuthenticateUserService();

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user, token });
  } catch (e) {
    return response.status(400).json({ message: e.message });
  }
});

export default sessionsRouter;
