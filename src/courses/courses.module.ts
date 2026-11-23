import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity'; // Ajusta la ruta según tu estructura
import { COURSE_REPOSITORY } from './application/ports/course.repository';
import { UpdateCourseUseCase } from './application/update-course.use-case';
import { TypeOrmCourseRepository } from './infrastructure/typeorm-course.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Course])], // <--- Registra la entidad aquí
  controllers: [CoursesController],
  providers: [
    CoursesService,
    UpdateCourseUseCase,
    { provide: COURSE_REPOSITORY, useClass: TypeOrmCourseRepository },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
