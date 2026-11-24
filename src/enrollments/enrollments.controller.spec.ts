import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  const enrollmentsService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findByStudent: vi.fn(),
    findByCourse: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [{ provide: EnrollmentsService, useValue: enrollmentsService }],
    }).compile();

    controller = module.get<EnrollmentsController>(EnrollmentsController);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('convierte los filtros de consulta antes de delegar', async () => {
    enrollmentsService.findAll.mockResolvedValue([]);

    await controller.findAll('2', '3');

    expect(enrollmentsService.findAll).toHaveBeenCalledWith(2, 3);
  });
});
