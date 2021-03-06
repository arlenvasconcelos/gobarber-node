import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/middlewares/ensureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const upload = multer(uploadConfig);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.get('/', usersController.index);

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);
export default usersRouter;
