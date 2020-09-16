import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersReposiroty = getRepository(User);

    const user = await usersReposiroty.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can chage avatar.');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await usersReposiroty.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
