import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../types';

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = req.body;
      const user = await userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const userData: UpdateUserDto = { ...req.body, id };
      const user = await userService.updateUser(userData);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUser(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginDto = req.body;
      const result = await userService.login(loginData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
} 