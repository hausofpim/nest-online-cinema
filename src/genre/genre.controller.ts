import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id-validation.pipe'
import { CreateGenreDto } from './dto/create-genre.dto'
import { GenreService } from './genre.service'

@ApiTags('genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.genreService.getBySlug(slug)
  }

  @Get('collections')
  async getCollections() {
    return await this.genreService.getCollections()
  }

  @Get()
  async getAllGenres() {
    return await this.genreService.getAllGenres()
  }

  @Get(':id')
  @Auth('admin')
  @ApiBearerAuth()
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.genreService.getById(id)
  }

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async createGenre() {
    return await this.genreService.create()
  }

  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async updateGenre(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateGenreDto
  ) {
    return await this.genreService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async deleteGenre(@Param('id', IdValidationPipe) id: string) {
    return await this.genreService.delete(id)
  }
}
