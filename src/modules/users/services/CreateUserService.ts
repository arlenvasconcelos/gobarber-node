import AppError from '@shared/errors/AppError';

import IUsersRepostory from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private usersRepository: IUsersRepostory) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUsedEmail = await this.usersRepository.findByEmail(email);

    if (checkUsedEmail) {
      throw new AppError('This email is already used');
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password,
    });

    delete user.password;

    return user;
  }
}

export default CreateUserService;
