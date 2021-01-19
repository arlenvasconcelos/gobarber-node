import { Response, Request } from 'express';

import { hash } from 'bcrypt';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
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
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userRepository = new UserRepository();
    const users = await userRepository.getAll();

    return response.json(users);
  }
}
