import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { EnrollmentsModule } from '.././enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    forwardRef(() => EnrollmentsModule), // ◄— Protege ambos lados del ciclo
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService], // ◄— Obligatorio para que Enrollments lo pueda usar
})
export class StudentsModule {}
