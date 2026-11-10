import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm'; // 1
import { Enrollments } from '../../enrollments/entities/enrollment.entity'
import { User } from '../../users/entities/user.entity';

@Entity('courses') // 2
export class Course { // 3
  @PrimaryGeneratedColumn() // 4
  id: number;

  @Column() // 5
  title: string;

  @Column() // 6
  level: string;

  @Column({ type: 'int', nullable: true })
  createdByUserId: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: User | null;

  @OneToMany(() => Enrollments, (enrollment) => enrollment.course)
  enrollments: Enrollments[];

}
