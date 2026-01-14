import { UserRepository } from '../../repositories/user/UserRepository';
import { UserSerializer } from '../../serializers/UserSerializer';
import type { Prisma, PrismaClient } from '@prisma/client';
import { getFirebaseAuth } from '../../lib/firebase';
import { generateRandomPassword } from '../../utils/passwordGenerator';
import { EmailService } from '../email/EmailService';

export class UserService {
  private repo: UserRepository;

  constructor(prismaClient?: PrismaClient) {
    this.repo = new UserRepository(prismaClient);
  }

  async list() {
    const users = await this.repo.findAll();
    return UserSerializer.list(users);
  }

  async get(id: string) {
    const user = await this.repo.findById(id);
    return UserSerializer.detail(user);
  }

  async create(data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role?: string;
    department: string;
    status?: string;
  }) {
    const existingUser = await this.repo.findByEmail(data.email.toLowerCase());
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await this.repo.findByUsername(
      data.username.startsWith('@') ? data.username : `@${data.username}`
    );
    if (existingUsername) {
      throw new Error('User with this username already exists');
    }

    const password = generateRandomPassword(16);

    const firebaseAuth = getFirebaseAuth();
    const firebaseUser = await firebaseAuth.createUser({
      email: data.email.toLowerCase(),
      password: password,
      displayName: `${data.firstName} ${data.lastName}`,
      emailVerified: false,
    });

    const username = data.username.startsWith('@') ? data.username : `@${data.username}`;

    const now = new Date();
    const user = await this.repo.create({
      firebaseId: firebaseUser.uid,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      username: username.trim(),
      email: data.email.toLowerCase().trim(),
      role: data.role || 'staffs',
      department: data.department,
      status: data.status || 'Active',
      joined: now,
      createdAt: now,
      updatedAt: now,
    });

    try {
      const emailService = new EmailService();
      const roleDisplayName = (data.role || 'staffs') === 'admin' ? 'Admin' : 'Staff';
      const usernameWithoutAt = username.startsWith('@') ? username.slice(1) : username;
      await emailService.sendCredentialsEmail({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email.toLowerCase(),
        username: usernameWithoutAt,
        password: password,
        department: data.department,
        role: roleDisplayName,
      });
    } catch (error: any) {
      console.error('Failed to send credentials email:', error);
    }

    return UserSerializer.detail(user);
  }

  async update(id: string, data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    department?: string;
    status?: string;
  }) {
    const updateData: Prisma.UserUpdateInput = {};

    if (data.firstName !== undefined) {
      updateData.firstName = data.firstName.trim();
    }

    if (data.lastName !== undefined) {
      updateData.lastName = data.lastName.trim();
    }

    if (data.username !== undefined) {
      const username = data.username.startsWith('@') ? data.username : `@${data.username}`;
      updateData.username = username.trim();
    }

    if (data.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }
      updateData.email = data.email.toLowerCase().trim();
    }

    if (data.department !== undefined) {
      updateData.department = data.department;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const user = await this.repo.updateById(id, updateData);
    return UserSerializer.detail(user);
  }

  async remove(id: string) {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.firebaseId) {
      const firebaseAuth = getFirebaseAuth();
      try {
        await firebaseAuth.deleteUser(user.firebaseId);
      } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }
      }
    }

    await this.repo.deleteById(id);
    return { success: true, message: 'User deleted successfully' };
  }
}

