import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Enrollments } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { StudentsService } from '../students/students.service'; // Importamos el servicio, no el repositorio

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollments)
    private readonly enrollmentRepository: Repository<Enrollments>,

    @Inject(forwardRef(() => StudentsService))
    private readonly studentsService: StudentsService, // ◄— Inyección segura del servicio hermano
  ) {}

  async create(dto: CreateEnrollmentDto): Promise<Enrollments> {
    // 1. Validar matrícula duplicada antes de continuar
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        student: { id: dto.studentId },
        course: { id: dto.courseId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('El estudiante ya se encuentra matriculado en este curso.');
    }

    // 2. Validar existencia y estado del estudiante usando su propio servicio aislado
    const student = await this.studentsService.findOne(dto.studentId);
    
    if (!student) {
      throw new NotFoundException(`El estudiante con ID ${dto.studentId} no existe en el sistema.`);
    }

    if (!student.isActive) {
      throw new BadRequestException('No se pueden generar matrículas para estudiantes inactivos.');
    }

    try {
      const newEnrollment = this.enrollmentRepository.create({
        student: { id: dto.studentId },
        course: { id: dto.courseId },
      });

      return await this.enrollmentRepository.save(newEnrollment);
    } catch (error: any) {
      // Captura fallos de llaves foráneas inexistentes (ej: curso id 9999 que no existe)
      if (error.code === '23503' || error.errno === 1452) {
        throw new NotFoundException('El curso especificado no existe en el sistema.');
      }
      throw error;
    }
  }

  async findAll(studentId?: number, courseId?: number): Promise<Enrollments[]> {
    const whereConditions: FindOptionsWhere<Enrollments> = {};

    if (studentId) whereConditions.student = { id: studentId };
    if (courseId) whereConditions.course = { id: courseId };

    return await this.enrollmentRepository.find({
      where: whereConditions,
      relations: {
        student: true,
        course: true,
      },
    });
  }

  async findByStudent(studentId: number): Promise<Enrollments[]> {
    return await this.enrollmentRepository.find({
      where: { student: { id: studentId } },
      relations: {
        course: true,
      },
    });
  }

  async findByCourse(courseId: number): Promise<Enrollments[]> {
    return await this.enrollmentRepository.find({
      where: { course: { id: courseId } },
      relations: {
        student: true,
      },
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const enrollment = await this.enrollmentRepository.findOne({ where: { id } });
    
    if (!enrollment) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    await this.enrollmentRepository.remove(enrollment);
    return { message: `Inscripción con ID ${id} eliminada exitosamente` };
  }
}
