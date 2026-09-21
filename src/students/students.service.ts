import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentStatusDto } from './dto/update-student-status.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { D } from 'vitest/dist/chunks/reporters.d.DtoKVV2s';

export interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  career: string;
  semester: number;
  isActive: boolean;
}

@Injectable()
export class StudentsService {
  private students: Student[] = [];

  private nextId = 1;

  create(createStudentDto: CreateStudentDto): Student {
    const emailExists = this.students.some(
      (student) => student.email.toLowerCase() === createStudentDto.email.toLowerCase(),
    );

    if (emailExists) {
      throw new ConflictException(
        'Ya existe un estudiante registrado con ese correo electrónico',
      );
    }

    const student: Student = {
      id: this.nextId++,
      ...createStudentDto,
    };

    this.students.push(student);

    return student;
  }

  findAll(filters?: FilterStudentDto): Student[] {
    let result = [...this.students];

    if (filters?.career) {
      result = result.filter(
        (student) =>
          student.career.toLowerCase() === filters.career!.toLowerCase(),
      );
    }

    if (filters?.semester !== undefined) {
      result = result.filter(
        (student) => student.semester === filters.semester,
      );
    }

    if (filters?.isActive !== undefined) {
      result = result.filter(
        (student) => student.isActive === filters.isActive,
      );
    }

    return result;
  }

  findOne(id: number): Student {
    const student = this.students.find(
      (student) => student.id === id,
    );

    if (!student) {
      throw new NotFoundException(
        `No existe un estudiante con el ID ${id}`,
      );
    }

    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto): Student {
    const student = this.findOne(id);

    if (updateStudentDto.email) {
      const emailExists = this.students.some(
        (otherStudent) =>
          otherStudent.id !== id &&
          otherStudent.email.toLowerCase() ===
            updateStudentDto.email!.toLowerCase(),
      );

      if (emailExists) {
        throw new ConflictException(
          'Ya existe otro estudiante con ese correo electrónico',
        );
      }
    }

    Object.assign(student, updateStudentDto);

    return student;
  }

  updateStatus(
    id: number,
    updateStatusDto: UpdateStudentStatusDto,
  ): Student {
    const student = this.findOne(id);

    student.isActive = updateStatusDto.isActive;

    return student;
  }

  remove(id: number): Student {
    const student = this.findOne(id);

    if (!student.isActive) {
      throw new ConflictException(
        'No se puede eliminar un estudiante que se encuentra inactivo',
      );
    }

    const index = this.students.findIndex(
      (student) => student.id === id,
    );

    this.students.splice(index, 1);

    return student;
  }
}
