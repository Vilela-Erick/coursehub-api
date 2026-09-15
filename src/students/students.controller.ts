import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentStatusDto } from './dto/update-student-status.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { ParseStudentIdPipe } from './pipes/parse-student-id.pipe';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll(@Query() filters: FilterStudentDto) {
    return this.studentsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseStudentIdPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseStudentIdPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseStudentIdPipe) id: number,
    @Body() updateStatusDto: UpdateStudentStatusDto,
  ) {
    return this.studentsService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseStudentIdPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
