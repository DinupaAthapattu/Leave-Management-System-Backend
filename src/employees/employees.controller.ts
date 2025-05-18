import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Make register public to bypass AuthGuard and RolesGuard
  @Public()
  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string; role?: Role }) {
    try {
      const employee = await this.employeesService.createEmployee(body);
      return { message: 'Employee registered successfully', employeeId: employee.id };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // sends 400 with message
      }
      console.error(error);
      throw new BadRequestException('Registration failed due to server error');
    }
  }

  // Protect all other routes with guards
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.employeesService.remove(id);
      return { message: 'Employee deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // sends 404 with message
      }
      console.error(error);
      throw new BadRequestException('Deletion failed due to server error');
    }
  }


}
