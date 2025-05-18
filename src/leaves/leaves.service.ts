// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { LeaveRequest, LeaveStatus, LeaveType, LeaveDayPart } from '@prisma/client';

// @Injectable()
// export class LeavesService {
//   constructor(private prisma: PrismaService) {}

//   // Create a new leave request with leaveType and dayPart
//   async createLeave(data: {
//     employeeId: number;
//     startDate: Date;
//     endDate: Date;
//     leaveType: LeaveType;
//     dayPart?: LeaveDayPart;
//     reason: string;
//   }): Promise<LeaveRequest> {
//     if (data.endDate < data.startDate) {
//       throw new BadRequestException('End date cannot be before start date');
//     }

//     const employee = await this.prisma.employee.findUnique({
//       where: { id: data.employeeId },
//     });

//     if (!employee) {
//       throw new NotFoundException('Employee not found');
//     }

//     return this.prisma.leaveRequest.create({
//       data: {
//         employeeId: data.employeeId,
//         startDate: data.startDate,
//         endDate: data.endDate,
//         leaveType: data.leaveType,
//         dayPart: data.dayPart ?? LeaveDayPart.FULL_DAY,
//         reason: data.reason,
//         status: LeaveStatus.PENDING,
//       },
//     });
//   }

//   // Get all leave requests or filter by employeeId
//   async findAll(employeeId?: number): Promise<LeaveRequest[]> {
//     if (employeeId) {
//       return this.prisma.leaveRequest.findMany({
//         where: { employeeId },
//         orderBy: { startDate: 'desc' },
//       });
//     }
//     return this.prisma.leaveRequest.findMany({ orderBy: { startDate: 'desc' } });
//   }

//   // Get one leave request by id
//   async findOne(id: number): Promise<LeaveRequest> {
//     const leave = await this.prisma.leaveRequest.findUnique({ where: { id } });
//     if (!leave) {
//       throw new NotFoundException('Leave request not found');
//     }
//     return leave;
//   }

//   // Update leave request
//   async update(
//     id: number,
//     data: Partial<{
//       startDate: Date;
//       endDate: Date;
//       leaveType: LeaveType;
//       dayPart: LeaveDayPart;
//       reason: string;
//       status: LeaveStatus;
//     }>,
//   ): Promise<LeaveRequest> {
//     const leave = await this.findOne(id);
//     if (data.startDate && data.endDate && data.endDate < data.startDate) {
//       throw new BadRequestException('End date cannot be before start date');
//     }

//     return this.prisma.leaveRequest.update({
//       where: { id },
//       data,
//     });
//   }

//   // Delete leave request
//   async remove(id: number): Promise<LeaveRequest> {
//     await this.findOne(id);
//     return this.prisma.leaveRequest.delete({ where: { id } });
//   }
// }

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaveRequest, LeaveStatus, LeaveType, LeaveDayPart } from '@prisma/client';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  // Create a new leave request with enum values for leaveType and dayPart
  async createLeave(data: {
    employeeId: number;
    startDate: Date;
    endDate: Date;
    leaveType: LeaveType;
    dayPart?: LeaveDayPart;
    reason: string;
  }): Promise<LeaveRequest> {
    if (data.endDate < data.startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.leaveRequest.create({
      data: {
        employeeId: data.employeeId,
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        dayPart: data.dayPart ?? LeaveDayPart.FULL_DAY,
        reason: data.reason,
        status: LeaveStatus.PENDING,
      },
    });
  }

  // Get all leave requests or filter by employeeId
  async findAll(employeeId?: number): Promise<LeaveRequest[]> {
    if (employeeId) {
      return this.prisma.leaveRequest.findMany({
        where: { employeeId },
        orderBy: { startDate: 'desc' },
      });
    }
    return this.prisma.leaveRequest.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  // Get one leave request by id
  async findOne(id: number): Promise<LeaveRequest> {
    const leave = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }
    return leave;
  }

  // Update leave request with validation
  async update(
    id: number,
    data: Partial<{
      startDate: Date;
      endDate: Date;
      leaveType: LeaveType;
      dayPart: LeaveDayPart;
      reason: string;
      status: LeaveStatus;
    }>,
  ): Promise<LeaveRequest> {
    const leave = await this.findOne(id);

    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data,
    });
  }

  // Delete leave request
  async remove(id: number): Promise<LeaveRequest> {
    await this.findOne(id);
    return this.prisma.leaveRequest.delete({ where: { id } });
  }
}
