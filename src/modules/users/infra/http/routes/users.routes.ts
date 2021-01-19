import { Router } from 'express';
import { hash } from 'bcrypt';
import { container } from 'tsyringe';
import multer from 'multer';

import uploadConfig from '@config/upload';

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@modules/users/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.get('/', async (request, response) => {
  const userRepository = new UserRepository();
  const users = await userRepository.getAll();

  return response.json(users);
});

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = container.resolve(CreateUserService);

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
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    response.json(user);
  },
);
export default usersRouter;
