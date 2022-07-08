import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id-validation.pipe'
import { UpdateMovieDto } from './dto/create-movie.dto'
import { getByGenresDto } from './dto/get-by-genres.dto'
import { updateCountOpenedDto } from './dto/update-count-opened.dto'
import { MovieService } from './movie.service'

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.movieService.getBySlug(slug)
  }

  @Get('by-actor/:actorId')
  @ApiParam({ name: 'actorId', type: 'string' })
  async getByActor(
    @Param('actorId', IdValidationPipe) actorId: Types.ObjectId
  ) {
    return await this.movieService.getByActor(actorId)
  }

  @Post('by-genres')
  @HttpCode(200)
  @ApiBody({ type: getByGenresDto })
  async getByGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
    return await this.movieService.getByGenres(genreIds)
  }

  @Get()
  async getAllMovies() {
    return await this.movieService.getAllMovies()
  }

  @Get('most-popular')
  async getMostPopularMovies() {
    return await this.movieService.getMostPopularMovies()
  }

  @Put('update-count-opened')
  @HttpCode(200)
  @ApiBody({ type: updateCountOpenedDto })
  async updateMovieOpenedCount(@Body('slug') slug: string) {
    return await this.movieService.updateCountOpened(slug)
  }

  @Get(':id')
  @Auth('admin')
  @ApiBearerAuth()
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.movieService.getById(id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async createMovie() {
    return await this.movieService.create()
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async updateMovie(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateMovieDto
  ) {
    return await this.movieService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async deleteMovie(@Param('id', IdValidationPipe) id: string) {
    return await this.movieService.delete(id)
  }
}
