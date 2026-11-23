export class CourseNotFoundError extends Error {
  constructor() {
    super('Course not found');
    this.name = 'CourseNotFoundError';
  }
}

export class CourseForbiddenError extends Error {
  constructor() {
    super('You cannot modify this course');
    this.name = 'CourseForbiddenError';
  }
}
