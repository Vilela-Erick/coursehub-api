import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from '../users/user-role.enum';
import { UpdateCourseUseCase } from './application/update-course.use-case';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

describe('CoursesService', () => {
  let service: CoursesService;
  const execute = vi.fn();
  const repository = {
    findAndCount: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: getRepositoryToken(Course), useValue: repository },
        { provide: UpdateCourseUseCase, useValue: { execute } },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('delega la actualización en el caso de uso con id, DTO e identidad', async () => {
    const dto = { title: 'NestJS avanzado' };
    const actor = { id: 4, email: 'teacher@example.com', role: UserRole.TEACHER };
    const updated = { id: 7, ...dto };
    execute.mockResolvedValue(updated);

    await expect(service.update(7, dto, actor)).resolves.toEqual(updated);

    expect(execute).toHaveBeenCalledWith(7, dto, actor);
  });
});
