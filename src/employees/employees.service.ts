import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Employee, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async createEmployee(data: {
    name: string;
    email: string;
    password: string;
    role?: Role;
  }): Promise<Employee> {
    const existingUser = await this.prisma.employee.findUnique({ where: { email: data.email } });
    if (existingUser) throw new BadRequestException('Email already in use');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || Role.EMPLOYEE,
      },
    });
  }

  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(
    id: number,
    data: Partial<{ name: string; email: string; role: Role; password: string }>
  ): Promise<Employee> {
    const employee = await this.findOne(id);
    if (data.email && data.email !== employee.email) {
      const existingUser = await this.prisma.employee.findUnique({ where: { email: data.email } });
      if (existingUser && existingUser.id !== id) throw new BadRequestException('Email already in use by another user');
    }
    const updatedData = { ...data };
    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    } else {
      delete updatedData.password;
    }
    return this.prisma.employee.update({ where: { id }, data: updatedData });
  }

  async remove(id: number): Promise<Employee> {
    await this.findOne(id);
    return this.prisma.employee.delete({ where: { id } });
  }
}
