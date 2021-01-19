import User from '../infra/typeorm/entities/User';

import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IAppointmentsRepository {
  getAll(): Promise<User[]>;
  create(data: ICreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}
