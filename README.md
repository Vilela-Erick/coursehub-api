<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observer](https://observer.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Filtros, paginación y ordenamiento

El endpoint `GET /courses` permite consultar cursos aplicando filtros por nivel y título, paginación y ordenamiento.

### Ejemplo de petición

`GET /courses?level=beginner&page=1&limit=3&sortBy=title&order=ASC`

### Estructura de respuesta

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 3,
    "totalPages": 0
  }
}
```

Los valores de la respuesta dependen de los registros encontrados.

### Validaciones

- `page`: entero mayor o igual a 1.
- `limit`: entero entre 1 y 50.
- `sortBy`: id, title o level.
- `order`: ASC o DESC.

Los parámetros inválidos devuelven HTTP 400 Bad Request.

## Autenticación de rutas

| Ruta | Acceso |
| --- | --- |
| `POST /auth/register`, `POST /auth/login` | Pública |
| `GET /auth/me` | Requiere JWT |
| `POST /courses` | Requiere JWT y rol admin o teacher |
| `PATCH /courses/:id` | Requiere JWT; admin o teacher propietario |
| `DELETE /courses/:id` | Requiere JWT y rol admin |
| `GET /enrollments`, `POST /enrollments` | Requiere JWT |
| Otras rutas de `/courses`, `/enrollments`, `/students` y `GET /` | Pública |

El registro y el inicio de sesión son públicos para que se pueda obtener una cuenta y un token. Crear cursos requiere rol `admin` o `teacher`; al crearlos, el propietario se toma del usuario autenticado. Crear o listar matrículas exige una identidad autenticada.

Envía `Authorization: Bearer <accessToken>` a las rutas protegidas. `GET /enrollments` conserva su respuesta y sus filtros `studentId` y `courseId`, pero ahora puede devolver `401 Unauthorized` si falta el encabezado o el token no es válido. `POST /enrollments` conserva su cuerpo y respuesta exitosa, y también puede devolver 401. En `POST /courses`, una solicitud sin token recibe 401 antes de ejecutar el controlador; con token válido, un cuerpo inválido sigue recibiendo 400 por la validación del DTO.

En `GET /auth/me`, el guard extrae el token, la estrategia verifica su firma y vencimiento y consulta el rol actual del usuario en la base. Si es válido, coloca `{ id, email, role }` en `req.user`. Un token alterado falla la verificación, por lo que `validate` y el controlador no se ejecutan y la respuesta es 401. Un token válido solo acredita identidad; los guards de roles y la comprobación de propiedad deciden si puede modificar o borrar un curso.

## Semana 10: roles, propiedad y acceso

Las cuentas nuevas reciben `student`. El registro público no acepta un rol enviado por el cliente. Para preparar las tres cuentas de práctica, regístralas normalmente y asigna los roles solo en la base **local**, mediante una cuenta administradora de PostgreSQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
UPDATE users SET role = 'teacher' WHERE email = 'teacher@example.com';
```

Sustituye esos correos por los de tus cuentas de práctica y confirma que cada `UPDATE` afectó exactamente una fila. La cuenta estudiante conserva el valor por defecto. Los cursos existentes tienen `createdByUserId` vacío; solo un admin puede actualizarlos hasta que se asigne un propietario verificado. El cliente no puede elegir el propietario en el cuerpo de `POST` o `PATCH /courses`.

| `PATCH /courses/:id` | Resultado |
| --- | --- |
| Sin token o con token inválido | 401 |
| Estudiante autenticado | 403 |
| Docente ajeno al curso | 403 |
| Docente propietario | 200 |
| Admin | 200 |

`DELETE /courses/:id` devuelve 403 para todo usuario autenticado que no sea admin. El rol se obtiene de la base en cada solicitud protegida, de modo que cambiarlo no exige esperar al vencimiento del JWT.

### CORS y login

Configura `CORS_ORIGINS` con los orígenes exactos del cliente web, separados por comas. Por ejemplo, en desarrollo: `CORS_ORIGINS=http://localhost:5173`. En producción usa únicamente los dominios HTTPS del cliente, por ejemplo `CORS_ORIGINS=https://app.example.com`. La lista vacía no autoriza ningún origen de navegador. CORS no reemplaza la autenticación ni bloquea clientes HTTP ajenos al navegador.

`POST /auth/login` acepta hasta 5 solicitudes por IP cada 60 segundos; la sexta devuelve 429. El contador incorporado es local a cada proceso: un despliegue con varias instancias necesita almacenamiento compartido para mantener un límite global.

### Evidencia para el documento de pruebas

Captura la petición y el código de respuesta para los cinco casos de `PATCH /courses/:id` de la tabla, además de `DELETE /courses/:id` con teacher (403) y admin (200), seis intentos seguidos de `POST /auth/login` (el último 429), y una petición CORS desde un origen permitido y otra desde uno no permitido. Para CORS, muestra que `Access-Control-Allow-Origin` aparece solo para el origen permitido; el servidor puede responder 200 al cliente HTTP aunque el navegador bloquee el origen no permitido. En cada captura oculta contraseñas, JWT completos, `JWT_SECRET` y datos personales reales. Anota el rol usado, el dueño del curso y el resultado esperado; así se entiende por qué cada respuesta es correcta.

### Producción

Sirve la API solo mediante HTTPS/TLS. La sincronización automática de TypeORM está desactivada cuando `NODE_ENV=production`; antes de desplegar cambios de esquema, prepara y ejecuta migraciones de base de datos.

## Semana 11: componentes transversales y actualización de cursos

La API aplica un middleware de registro a las rutas. Cada solicitud registra método, ruta sin parámetros de consulta, estado y duración. El interceptor mide el tiempo de ejecución del método. Ninguno registra cuerpos, contraseñas ni el encabezado `Authorization`.

El filter global devuelve los errores con `statusCode`, `path`, `timestamp` y `message`. Para un error inesperado responde `500` con el mensaje genérico `Internal server error`; el registro interno conserva solo el tipo de error y el contexto de la ruta. `ValidationPipe` sigue siendo global y `GET /courses/:id` usa `ParseIntPipe` para rechazar identificadores no numéricos con 400.

La operación `PATCH /courses/:id` conserva su método, cuerpo y respuestas. Su flujo interno ahora es:

```text
CoursesController → CoursesService → UpdateCourseUseCase
                                     ↓
                               CourseRepository
                                     ↓
                             TypeOrmCourseRepository
                                     ↓
                                 PostgreSQL
```

`UpdateCourseUseCase` contiene la regla de propiedad y depende únicamente del puerto `CourseRepository`. Si cambia esa regla, se modifica el caso de uso; si se reemplaza TypeORM, se modifica el adaptador. Los cursos nuevos y las demás operaciones del módulo permanecen en `CoursesService` durante esta refactorización gradual.

Prueba enfocada sin base de datos: `npm run test -- src/courses/application/update-course.use-case.spec.ts`. La demostración HTTP verifica 200 para el docente propietario, 400 para un identificador inválido, 404 para un recurso inexistente y 403 para un docente ajeno.
