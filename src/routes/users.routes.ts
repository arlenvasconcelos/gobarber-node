import { Router } from 'express';
import { hash } from 'bcrypt';
import { getRepository } from 'typeorm';
import multer from 'multer';

import User from '../models/User';

import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

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

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    response.json(user);
  },
);
export default usersRouter;
