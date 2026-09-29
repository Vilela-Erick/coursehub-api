import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity'; // Ajusta la ruta según tu estructura

@Module({
  imports: [TypeOrmModule.forFeature([Course])], // <--- Registra la entidad aquí
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
