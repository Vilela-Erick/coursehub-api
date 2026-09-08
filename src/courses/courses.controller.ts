import {
    Controller,
    Get,
    Query,
    Param,
    Post,
    Body,
    Delete,
    Patch,
} from '@nestjs/common';

import { CoursesService } from './courses.service.js';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Get()
    findAll(@Query('level') level?: string) {
        return this.coursesService.findAll(level);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(Number(id));
    }

    @Post()
    create(@Body() course: { title: string; level: string }) {
        return this.coursesService.create(course);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() course: { title?: string; level?: string },
    ) {
        return this.coursesService.update(Number(id), course);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coursesService.remove(Number(id));
    }
}
