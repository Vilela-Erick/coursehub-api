import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollments } from './entities/enrollment.entity';
import { StudentsModule } from '.././students/students.module'; // Importa el módulo completo

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollments]),
    forwardRef(() => StudentsModule), // ◄— Esto rompe la dependencia circular de raíz
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
