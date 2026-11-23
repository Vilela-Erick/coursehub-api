import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRepository, CourseForUpdate } from '../application/ports/course.repository';
import { Course } from '../entities/course.entity';

@Injectable()
export class TypeOrmCourseRepository implements CourseRepository {
  constructor(
    @InjectRepository(Course)
    private readonly repository: Repository<Course>,
  ) {}

  findById(id: number): Promise<Course | null> {
    return this.repository.findOne({
      where: { id },
      relations: { enrollments: true },
    });
  }

  save(course: CourseForUpdate): Promise<Course> {
    return this.repository.save(course as Course);
  }
}
