import { Injectable } from '@nestjs/common';

type Course = {
    id: number;
    title: string;
    level: string;
};

@Injectable()
export class CoursesService {
    private readonly courses: Course[] = [
        { id: 1, title: 'NestJS Fundamentals', level: 'beginner' },
        { id: 2, title: 'REST APIs with NestJS', level: 'beginner' },
        { id: 3, title: 'NestJS Architecture', level: 'intermediate' },
    ];

    findAll(level?: string): Course[] {
        if (!level) {
            return this.courses;
        }

        return this.courses.filter((course) => course.level === level);
    }

    findOne(id: number): Course | undefined {
        return this.courses.find((course) => course.id === id);
    }

    create(course: { title: string; level: string }): Course {
        const newCourse: Course = {
            id: this.courses.length + 1,
            title: course.title,
            level: course.level,
        };

        this.courses.push(newCourse);

        return newCourse;
    }

    update(
        id: number,
        data: { title?: string; level?: string },
    ): Course | undefined {
        const course = this.courses.find((course) => course.id === id);

        if (!course) {
            return undefined;
        }

        if (data.title !== undefined) {
            course.title = data.title;
        }

        if (data.level !== undefined) {
            course.level = data.level;
        }

        return course;
    }

    remove(id: number): Course | undefined {
        const index = this.courses.findIndex((course) => course.id === id);

        if (index === -1) {
            return undefined;
        }

        const deletedCourse = this.courses[index];

        this.courses.splice(index, 1);

        return deletedCourse;
    }
}
