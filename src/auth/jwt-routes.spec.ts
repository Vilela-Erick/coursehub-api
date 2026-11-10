import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CoursesController } from '../courses/courses.controller';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsController } from '../enrollments/enrollments.controller';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user-role.enum';

describe('Rutas protegidas con JWT', () => {
  let app: INestApplication;
  let jwt: JwtService;
  const secret = 'session-18-test-secret-at-least-32-characters';
  const createCourse = vi.fn();
  const createEnrollment = vi.fn();
  const findEnrollments = vi.fn();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule, JwtModule.register({ secret }), ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }])],
      controllers: [AuthController, CoursesController, EnrollmentsController],
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: { getOrThrow: () => secret } },
        { provide: UsersService, useValue: { findById: async () => ({ id: 1, email: 'ana@example.com', role: UserRole.TEACHER }) } },
        { provide: AuthService, useValue: { login: async () => { throw new UnauthorizedException(); } } },
        { provide: CoursesService, useValue: { create: createCourse } },
        { provide: EnrollmentsService, useValue: { create: createEnrollment, findAll: findEnrollments } },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    jwt = module.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    createCourse.mockReset();
    createEnrollment.mockReset();
    findEnrollments.mockReset();
  });

  it('rechaza /auth/me sin token y con token alterado', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
    const token = jwt.sign({ sub: 1, email: 'ana@example.com' });
    await request(app.getHttpServer()).get('/auth/me').set('Authorization', `Bearer ${token}x`).expect(401);
  });

  it('devuelve id, email y rol en /auth/me', async () => {
    const token = jwt.sign({ sub: 1, email: 'ana@example.com' });
    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, { id: 1, email: 'ana@example.com', role: UserRole.TEACHER });
  });

  it('bloquea la creación de cursos antes del servicio y conserva la validación del DTO', async () => {
    const body = { title: 'NestJS medio', level: 'intermediate' };
    await request(app.getHttpServer()).post('/courses').send(body).expect(401);
    expect(createCourse).not.toHaveBeenCalled();

    const token = jwt.sign({ sub: 1, email: 'ana@example.com' });
    createCourse.mockResolvedValue({ id: 1, ...body });
    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(201, { id: 1, ...body });
    expect(createCourse).toHaveBeenCalledWith(body, { id: 1, email: 'ana@example.com', role: UserRole.TEACHER });

    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', level: 'invalid' })
      .expect(400);
    expect(createCourse).toHaveBeenCalledTimes(1);
  });

  it('exige JWT para leer matrículas sin cambiar la respuesta', async () => {
    await request(app.getHttpServer()).get('/enrollments').expect(401);
    expect(findEnrollments).not.toHaveBeenCalled();

    const token = jwt.sign({ sub: 1, email: 'ana@example.com' });
    findEnrollments.mockResolvedValue([{ id: 4 }]);
    await request(app.getHttpServer())
      .get('/enrollments?studentId=2')
      .set('Authorization', `Bearer ${token}`)
      .expect(200, [{ id: 4 }]);
    expect(findEnrollments).toHaveBeenCalledWith(2, undefined);
  });

  it('exige JWT para crear matrículas', async () => {
    const body = { studentId: 2, courseId: 3 };
    await request(app.getHttpServer()).post('/enrollments').send(body).expect(401);
    expect(createEnrollment).not.toHaveBeenCalled();

    const token = jwt.sign({ sub: 1, email: 'ana@example.com' });
    createEnrollment.mockResolvedValue({ id: 5, ...body });
    await request(app.getHttpServer())
      .post('/enrollments')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(201, { id: 5, ...body });
    expect(createEnrollment).toHaveBeenCalledWith(body);
  });

  it('limita POST /auth/login y devuelve 429 al sexto intento', async () => {
    const body = { email: 'ana@example.com', password: 'wrongpassword' };
    for (let attempt = 0; attempt < 5; attempt++) {
      await request(app.getHttpServer()).post('/auth/login').send(body).expect(401);
    }
    await request(app.getHttpServer()).post('/auth/login').send(body).expect(429);
  });
});
