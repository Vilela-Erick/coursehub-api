import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentStatusDto } from './dto/update-student-status.dto';
import { FilterStudentDto } from './dto/filter-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const newStudent = this.studentRepository.create(createStudentDto);
      return await this.studentRepository.save(newStudent);
    } catch (error: any) {
      // Captura el error de restricción única (PostgreSQL: 23505, MySQL: 1062)
      if (error.code === '23505' || error.errno === 1062) {
        throw new ConflictException(`El correo electrónico '${createStudentDto.email}' ya está siendo utilizado por otro estudiante.`);
      }
      throw error;
    }
  }

  async findAll(filters: FilterStudentDto): Promise<Student[]> {
    const whereConditions: FindOptionsWhere<Student> = {};

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== '') {
          (whereConditions as any)[key] = value;
        }
      }
    }

    return await this.studentRepository.find({
      where: whereConditions,
      relations: {
        enrollments: true,
      },
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: {
        enrollments: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    const updatedStudent = this.studentRepository.merge(student, updateStudentDto);
    
    try {
      return await this.studentRepository.save(updatedStudent);
    } catch (error: any) {
      // También protegemos el update por si intentan cambiar el email a uno duplicado
      if (error.code === '23505' || error.errno === 1062) {
        throw new ConflictException(`El correo electrónico '${updateStudentDto.email}' ya está siendo utilizado por otro estudiante.`);
      }
      throw error;
    }
  }

  async updateStatus(id: number, updateStatusDto: UpdateStudentStatusDto): Promise<Student> {
    const student = await this.findOne(id);
    student.isActive = updateStatusDto.isActive;
    return await this.studentRepository.save(student);
  }

  async remove(id: number): Promise<{ message: string }> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
    return { message: `Estudiante con ID ${id} eliminado exitosamente` };
  }
}
