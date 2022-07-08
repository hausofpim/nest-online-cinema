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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id-validation.pipe'
import { ActorService } from './actor.service'
import { ActorDto } from './dto/actor.dto'

@ApiTags('actors')
@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @ApiOperation({ summary: 'Найти актера по slug' })
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return await this.actorService.getBySlug(slug)
  }

  @ApiOperation({ summary: 'Получить всех актеров' })
  @Get()
  async getAllActors() {
    return await this.actorService.getAllActors()
  }

  @ApiOperation({ summary: 'Получить актера по айди' })
  @ApiBearerAuth()
  @Get(':id')
  @Auth('admin')
  async getById(@Param('id', IdValidationPipe) id: string) {
    return await this.actorService.getById(id)
  }

  @ApiOperation({ summary: 'Создать нового пустого актера' })
  @ApiBearerAuth()
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async createActor() {
    return await this.actorService.create()
  }

  @ApiOperation({ summary: 'Изменить актера по айди' })
  @ApiBearerAuth()
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateActor(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto
  ) {
    return await this.actorService.update(id, dto)
  }

  @ApiOperation({ summary: 'Удалить актера по айди' })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteActor(@Param('id', IdValidationPipe) id: string) {
    return await this.actorService.delete(id)
  }
}
