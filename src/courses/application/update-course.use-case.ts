import { Inject, Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../../auth/types/jwt-payload.type';
import { UserRole } from '../../users/user-role.enum';
import { CourseForbiddenError, CourseNotFoundError } from './course-errors';
import { COURSE_REPOSITORY, CourseChanges, CourseRepository } from './ports/course.repository';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courses: CourseRepository,
  ) {}

  async execute(id: number, changes: CourseChanges, actor: AuthenticatedUser) {
    const course = await this.courses.findById(id);
    if (!course) throw new CourseNotFoundError();

    const canManageAny = actor.role === UserRole.ADMIN;
    const isTeacherOwner = actor.role === UserRole.TEACHER && course.createdByUserId === actor.id;
    if (!canManageAny && !isTeacherOwner) throw new CourseForbiddenError();

    Object.assign(course, changes);
    return this.courses.save(course);
  }
}
