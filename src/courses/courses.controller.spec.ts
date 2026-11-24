import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../users/user-role.enum';
import { CourseForbiddenError } from './application/course-errors';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CoursesController', () => {
  let controller: CoursesController;
  const update = vi.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [{ provide: CoursesService, useValue: { update } }],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    vi.clearAllMocks();
  });

  it('delega la actualización con id, DTO e identidad autenticada', async () => {
    const dto: UpdateCourseDto = { title: 'NestJS avanzado' };
    const actor = { id: 4, email: 'teacher@example.com', role: UserRole.TEACHER };
    const updated = { id: 7, title: dto.title, level: 'beginner' };
    update.mockResolvedValue(updated);

    await expect(controller.update(7, dto, actor)).resolves.toEqual(updated);

    expect(update).toHaveBeenCalledWith(7, dto, actor);
    expect(update).toHaveBeenCalledOnce();
  });

  it('propaga el error del caso de uso sin convertirlo en una respuesta exitosa', async () => {
    const dto: UpdateCourseDto = { title: 'Cambio' };
    const actor = { id: 9, email: 'other@example.com', role: UserRole.TEACHER };
    const error = new CourseForbiddenError();
    update.mockRejectedValue(error);

    await expect(controller.update(7, dto, actor)).rejects.toBe(error);
  });
});
