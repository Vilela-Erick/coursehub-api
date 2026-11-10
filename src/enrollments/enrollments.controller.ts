import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private enrollmentsService: EnrollmentsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('studentId') studentId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.enrollmentsService.findAll(
      studentId ? Number(studentId) : undefined,
      courseId ? Number(courseId) : undefined,
    );
  }

  @Get('/students/:studentId/enrollments')
  findByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Get('/courses/:courseId/enrollments')
  findByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}
