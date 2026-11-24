import { Test } from '@nestjs/testing';
import type { Mocked } from 'vitest';
import { UserRole } from '../../users/user-role.enum';
import { CourseForbiddenError, CourseNotFoundError } from './course-errors';
import { COURSE_REPOSITORY, CourseForUpdate, CourseRepository } from './ports/course.repository';
import { UpdateCourseUseCase } from './update-course.use-case';

describe('UpdateCourseUseCase', () => {
  const owner = { id: 2, email: 'owner@example.com', role: UserRole.TEACHER };
  const otherTeacher = { id: 3, email: 'other@example.com', role: UserRole.TEACHER };
  const admin = { id: 4, email: 'admin@example.com', role: UserRole.ADMIN };
  const course: CourseForUpdate = {
    id: 7,
    title: 'NestJS',
    level: 'beginner',
    createdByUserId: owner.id,
  };

  let useCase: UpdateCourseUseCase;
  let repository: Mocked<CourseRepository>;

  beforeEach(async () => {
    repository = {
      findById: vi.fn(),
      save: vi.fn(async (value) => value),
    };

    const module = await Test.createTestingModule({
      providers: [
        UpdateCourseUseCase,
        { provide: COURSE_REPOSITORY, useValue: repository },
      ],
    }).compile();

    useCase = module.get(UpdateCourseUseCase);
    vi.clearAllMocks();
  });

  it('permite al docente propietario actualizar el curso', async () => {
    repository.findById.mockResolvedValue({ ...course });

    const result = await useCase.execute(7, { title: 'NestJS avanzado' }, owner);

    expect(result.title).toBe('NestJS avanzado');
    expect(repository.findById).toHaveBeenCalledWith(7);
    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 7, title: 'NestJS avanzado' }),
    );
  });

  it('rechaza un curso inexistente sin guardar', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute(99, { title: 'Nuevo' }, owner)).rejects.toBeInstanceOf(
      CourseNotFoundError,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rechaza al docente ajeno sin guardar', async () => {
    repository.findById.mockResolvedValue({ ...course });

    await expect(useCase.execute(7, { title: 'Cambio' }, otherTeacher)).rejects.toBeInstanceOf(
      CourseForbiddenError,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('permite al admin actualizar un curso ajeno', async () => {
    repository.findById.mockResolvedValue({ ...course });

    const result = await useCase.execute(7, { level: 'advanced' }, admin);

    expect(result.level).toBe('advanced');
    expect(repository.save).toHaveBeenCalledOnce();
  });
});
