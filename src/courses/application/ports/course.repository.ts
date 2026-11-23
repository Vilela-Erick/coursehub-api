export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export type CourseForUpdate = {
  id: number;
  title: string;
  level: string;
  createdByUserId: number | null;
};

export type CourseChanges = Partial<Pick<CourseForUpdate, 'title' | 'level'>>;

export interface CourseRepository {
  findById(id: number): Promise<CourseForUpdate | null>;
  save(course: CourseForUpdate): Promise<CourseForUpdate>;
}
