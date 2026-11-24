import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentsService } from '../students/students.service';
import { EnrollmentsService } from './enrollments.service';
import { Enrollments } from './entities/enrollment.entity';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  const repository = {
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };
  const studentsService = { findOne: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: getRepositoryToken(Enrollments), useValue: repository },
        { provide: StudentsService, useValue: studentsService },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
