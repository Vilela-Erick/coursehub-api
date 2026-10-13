import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'; // 1
import { Enrollments } from '../../enrollments/entities/enrollment.entity'

@Entity('courses') // 2
export class Course { // 3
  @PrimaryGeneratedColumn() // 4
  id: number;

  @Column() // 5
  title: string;

  @Column() // 6
  level: string;

  @OneToMany(() => Enrollments, (enrollment) => enrollment.course)
  enrollments: Enrollments[];

}