import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { CreateUserDto, UpdateUserDto, LoginDto, AuthResponse, UserWithRelations } from '../types';
import type { PrismaClient } from '@prisma/client';

export class UserService {
  async createUser(data: CreateUserDto): Promise<UserWithRelations> {
    const { password, ...userData } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username }
        ]
      }
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const createData = {
      ...userData,
      auth: {
        create: {
          passwordHash
        }
      },
      address: data.address ? {
        create: {
          ...data.address,
          geo: data.address.geo ? {
            create: data.address.geo
          } : undefined
        }
      } : undefined,
      company: data.company ? {
        create: data.company
      } : undefined
    };

    const user = await prisma.user.create({
      data: createData,
      include: {
        address: {
          include: {
            geo: true
          }
        },
        company: true
      }
    });

    return user as UserWithRelations;
  }

  async updateUser(data: UpdateUserDto): Promise<UserWithRelations> {
    const { id, password, ...updateData } = data;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { auth: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.auth.update({
        where: { userId: id },
        data: { passwordHash }
      });
    }

    const updateInput = {
      ...updateData,
      address: updateData.address ? {
        upsert: {
          create: {
            ...updateData.address,
            geo: updateData.address.geo ? {
              create: updateData.address.geo
            } : undefined
          },
          update: {
            ...updateData.address,
            geo: updateData.address.geo ? {
              upsert: {
                create: updateData.address.geo,
                update: updateData.address.geo
              }
            } : undefined
          }
        }
      } : undefined,
      company: updateData.company ? {
        upsert: {
          create: updateData.company,
          update: updateData.company
        }
      } : undefined
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateInput,
      include: {
        address: {
          include: {
            geo: true
          }
        },
        company: true
      }
    });

    return updatedUser as UserWithRelations;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.user.delete({
      where: { id }
    });
  }

  async getUser(id: number): Promise<UserWithRelations> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        address: {
          include: {
            geo: true
          }
        },
        company: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user as UserWithRelations;
  }

  async getAllUsers(): Promise<UserWithRelations[]> {
    const users = await prisma.user.findMany({
      include: {
        address: {
          include: {
            geo: true
          }
        },
        company: true
      }
    });

    return users as UserWithRelations[];
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        auth: true,
        address: {
          include: {
            geo: true
          }
        },
        company: true
      }
    });

    if (!user || !user.auth) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.auth.passwordHash
    );

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400') // Default to 1 day in seconds
      }
    );

    const { auth, ...userWithoutAuth } = user;

    return {
      token,
      user: userWithoutAuth as UserWithRelations
    };
  }
} 