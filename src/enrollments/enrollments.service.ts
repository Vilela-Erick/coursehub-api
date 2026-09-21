import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

type Enrollment = {
  id: number;
  studentId: number;
  courseId: number;
};

@Injectable()
export class EnrollmentsService {
  private enrollments: Enrollment[] = [];
  private nextId = 1;

  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
  ) {}

  create(dto: CreateEnrollmentDto) {
    const student = this.studentsService.findOne(dto.studentId);

    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const course = this.coursesService.findOne(dto.courseId);

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (!student.isActive) {
      throw new ConflictException('El estudiante está inactivo');
    }

    const exists = this.enrollments.find(
      enrollment =>
        enrollment.studentId === dto.studentId &&
        enrollment.courseId === dto.courseId,
    );

    if (exists) {
      throw new ConflictException('La matrícula ya existe');
    }

    const enrollment = {
      id: this.nextId++,
      studentId: dto.studentId,
      courseId: dto.courseId,
    };

    this.enrollments.push(enrollment);

    return enrollment;
  }

  findAll(studentId?: number, courseId?: number) {
    return this.enrollments.filter(enrollment => {
      if (
        studentId !== undefined &&
        enrollment.studentId !== studentId
      ) {
        return false;
      }

      if (
        courseId !== undefined &&
        enrollment.courseId !== courseId
      ) {
        return false;
      }

      return true;
    });
  }

  findByStudent(studentId: number) {
    return this.enrollments.filter(
      enrollment => enrollment.studentId === studentId,
    );
  }

  findByCourse(courseId: number) {
    return this.enrollments.filter(
      enrollment => enrollment.courseId === courseId,
    );
  }

  remove(id: number) {
    const index = this.enrollments.findIndex(
      enrollment => enrollment.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Matrícula no encontrada');
    }

    return this.enrollments.splice(index, 1)[0];
  }
}
