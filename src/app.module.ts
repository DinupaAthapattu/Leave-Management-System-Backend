import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeesModule } from './employees/employees.module';
import { AuthModule } from './auth/auth.module';
import { LeavesModule } from './leaves/leaves.module';

@Module({
  imports: [PrismaModule, EmployeesModule, AuthModule, LeavesModule],
})
export class AppModule {}
