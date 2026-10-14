import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto'; // Corregido: removido .js
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity'; // Corregido: removido .js
import { CoursesQueryDto } from './dto/courses-query.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async findAll(query: CoursesQueryDto) {
    const { level, title, page, limit, sortBy, order } = query;

    const [items, total] = await this.coursesRepository.findAndCount({
      where: {
        ...(level ? { level } : {}),
        ...(title ? { title } : {}),
      },
      order: {
        [sortBy]: order,
        id: sortBy === 'id' ? order : 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Course> {
    // Corregido: cambiado findOneBy por find para poder incluir el objeto de relaciones estricto
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: {
        enrollments: true, // Integrado: Muestra las inscripciones de este curso específico
      },
    });

    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }
    return course;
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto);
    return await this.coursesRepository.save(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id); // Valida automáticamente si existe
    const updatedCourse = this.coursesRepository.merge(course, updateCourseDto); // Consistente con TypeORM strict
    return await this.coursesRepository.save(updatedCourse);
  }

  async remove(id: number): Promise<Course> {
    const course = await this.findOne(id);
    return await this.coursesRepository.remove(course);
  }
}
