
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeaveStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  async create(
    @Body()
    body: {
      startDate: string;
      endDate: string;
      leaveType: 'ANNUAL' | 'CASUAL_SICK' | 'LIEU';
      dayPart?: 'FULL_DAY' | 'FIRST_HALF' | 'SECOND_HALF';
      reason: string;
    },
    @Request() req,
  ) {
    const employeeId = req.user.userId;

    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    const dayPart = body.dayPart || 'FULL_DAY';

    if (start.getTime() !== end.getTime() && dayPart !== 'FULL_DAY') {
      throw new BadRequestException(
        'Half day option is only allowed if startDate and endDate are the same',
      );
    }

    return this.leavesService.createLeave({
      employeeId,
      startDate: start,
      endDate: end,
      leaveType: body.leaveType,
      dayPart,
      reason: body.reason,
    });
  }

  @Get()
  async findAll(@Query('employeeId') employeeId?: string) {
    return this.leavesService.findAll(employeeId ? Number(employeeId) : undefined);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leavesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN) // Only admins can update the status
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ startDate: string; endDate: string; reason: string; status: LeaveStatus }>,
    @Request() req, // to verify if employee is trying to update their own leave
  ) {
    const userId = req.user.userId;
    const leave = await this.leavesService.findOne(id);

    // Check if the leave request belongs to the logged-in user and allow employees to update only their own requests
    if (leave.employeeId !== userId && req.user.role !== Role.ADMIN) {
      throw new BadRequestException('You can only update your own leave request');
    }

    const updateData: any = { ...body };
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);

    return this.leavesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Only admins can delete leave requests
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.leavesService.remove(id);
  }
}
