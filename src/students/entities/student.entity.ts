import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Enrollments } from '../../enrollments/entities/enrollment.entity';

@Entity('students') // Recomendado en minúsculas y plural para BD
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) // El email suele ser único
  email: string;

  @Column()
  age: number;

  @Column()
  career: string;

  @Column()
  semester: number;

  @Column({ default: true }) // Por defecto inicia activo
  isActive: boolean;

  // ESTO SOLUCIONA EL PRIMER ERROR:
  @OneToMany(() => Enrollments, (enrollment) => enrollment.student)
  enrollments: Enrollments[];
}
