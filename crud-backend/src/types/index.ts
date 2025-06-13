import { User, Address, Company, Auth } from '@prisma/client';

export interface Geo {
  lat: string;
  lng: string;
}

export interface AddressWithGeo extends Omit<Address, 'geo'> {
  geo: Geo | null;
}

export interface UserWithRelations extends Omit<User, 'address' | 'company' | 'auth'> {
  address: AddressWithGeo | null;
  company: Company | null;
}

export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserWithRelations;
}

export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
} 