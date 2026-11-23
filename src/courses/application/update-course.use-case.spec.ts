import { UserRole } from '../../users/user-role.enum';
import { CourseForbiddenError, CourseNotFoundError } from './course-errors';
import { CourseForUpdate, CourseRepository } from './ports/course.repository';
import { UpdateCourseUseCase } from './update-course.use-case';

describe('UpdateCourseUseCase', () => {
  const owner = { id: 2, email: 'owner@example.com', role: UserRole.TEACHER };
  const other = { id: 3, email: 'other@example.com', role: UserRole.TEACHER };
  const admin = { id: 4, email: 'admin@example.com', role: UserRole.ADMIN };

  function setup(course: CourseForUpdate | null) {
    const repository: CourseRepository = {
      findById: vi.fn().mockResolvedValue(course),
      save: vi.fn(async (value) => value),
    };
    return { useCase: new UpdateCourseUseCase(repository), repository };
  }

  it('rechaza un curso inexistente', async () => {
    const { useCase } = setup(null);
    await expect(useCase.execute(99, { title: 'Nuevo' }, owner)).rejects.toBeInstanceOf(CourseNotFoundError);
  });

  it('rechaza al docente ajeno sin guardar', async () => {
    const { useCase, repository } = setup({ id: 1, title: 'Original', level: 'beginner', createdByUserId: 2 });
    await expect(useCase.execute(1, { title: 'Nuevo' }, other)).rejects.toBeInstanceOf(CourseForbiddenError);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it.each([owner, admin])('permite actualizar al propietario o admin', async (actor) => {
    const { useCase, repository } = setup({ id: 1, title: 'Original', level: 'beginner', createdByUserId: 2 });
    const result = await useCase.execute(1, { title: 'Nuevo' }, actor);
    expect(result.title).toBe('Nuevo');
    expect(repository.save).toHaveBeenCalledOnce();
  });
});
