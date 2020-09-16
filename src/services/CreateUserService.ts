import { getRepository } from 'typeorm';
import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUsedEmail = await usersRepository.findOne({
      email,
    });

    if (checkUsedEmail) {
      throw new AppError('This email is already used');
    }

    const user = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default CreateUserService;
