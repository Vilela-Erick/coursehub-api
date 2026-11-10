import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Course } from '../courses/entities/course.entity';
import { CoursesController } from '../courses/courses.controller';
import { CoursesService } from '../courses/courses.service';
import { UserRole } from '../users/user-role.enum';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './strategies/jwt.strategy';

describe('Autorización de cursos', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const secret = 'week-10-test-secret-at-least-32-characters';
  const users = [
    { id: 1, email: 'student@example.com', role: UserRole.STUDENT },
    { id: 2, email: 'owner@example.com', role: UserRole.TEACHER },
    { id: 3, email: 'other@example.com', role: UserRole.TEACHER },
    { id: 4, email: 'admin@example.com', role: UserRole.ADMIN },
  ];
  let course: { id: number; title: string; level: string; createdByUserId: number };
  const save = vi.fn(async (value: typeof course) => value);
  const remove = vi.fn(async (value: typeof course) => value);
  const repository = {
    findOneBy: vi.fn(async ({ id }: { id: number }) => id === course.id ? course : null),
    findOne: vi.fn(async ({ where }: { where: { id: number } }) => where.id === course.id ? course : null),
    create: vi.fn((value: typeof course) => value),
    merge: vi.fn((target: typeof course, patch: Partial<typeof course>) => Object.assign(target, patch)),
    save,
    remove,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule, JwtModule.register({ secret })],
      controllers: [CoursesController],
      providers: [
        CoursesService,
        JwtStrategy,
        { provide: getRepositoryToken(Course), useValue: repository },
        { provide: ConfigService, useValue: { getOrThrow: () => secret } },
        { provide: UsersService, useValue: { findById: async (id: number) => users.find((user) => user.id === id) ?? null } },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    jwt = module.get(JwtService);
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    course = { id: 10, title: 'Original', level: 'beginner', createdByUserId: 2 };
    save.mockClear();
    remove.mockClear();
  });

  const tokenFor = (id: number) => {
    const user = users.find((item) => item.id === id)!;
    return `Bearer ${jwt.sign({ sub: user.id, email: user.email })}`;
  };

  it('distingue 401, 403 y acceso autorizado en la misma actualización', async () => {
    const body = { title: 'Actualizado' };
    await request(app.getHttpServer()).patch('/courses/10').send(body).expect(401);
    await request(app.getHttpServer()).patch('/courses/10').set('Authorization', tokenFor(1)).send(body).expect(403);
    await request(app.getHttpServer()).patch('/courses/10').set('Authorization', tokenFor(3)).send(body).expect(403);
    expect(save).not.toHaveBeenCalled();

    await request(app.getHttpServer()).patch('/courses/10').set('Authorization', tokenFor(2)).send(body).expect(200);
    expect(save).toHaveBeenCalledOnce();
    expect(course.title).toBe('Actualizado');

    await request(app.getHttpServer()).patch('/courses/10').set('Authorization', tokenFor(4)).send({ title: 'Admin edit' }).expect(200);
    expect(save).toHaveBeenCalledTimes(2);
  });

  it('reserva el borrado para admin', async () => {
    await request(app.getHttpServer()).delete('/courses/10').expect(401);
    await request(app.getHttpServer()).delete('/courses/10').set('Authorization', tokenFor(2)).expect(403);
    await request(app.getHttpServer()).delete('/courses/10').set('Authorization', tokenFor(4)).expect(200);
    expect(remove).toHaveBeenCalledOnce();
  });

  it('toma el propietario del JWT y rechaza un ownerId enviado por el cliente', async () => {
    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', tokenFor(2))
      .send({ title: 'Nuevo', level: 'beginner', createdByUserId: 3 })
      .expect(400);

    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', tokenFor(2))
      .send({ title: 'Nuevo', level: 'beginner' })
      .expect(201);
    expect(repository.create).toHaveBeenCalledWith({ title: 'Nuevo', level: 'beginner', createdByUserId: 2 });
  });
});
