import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { CreateGenreDto } from './dto/create-genre.dto'
import { GenreModel } from './genre.model'

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
  ) {}

  async getBySlug(slug: string) {
    return await this.GenreModel.findOne({ slug }).exec()
  }

  async getAllGenres(searchQuery?: string) {
    let options = {}

    if (searchQuery) {
      options = {
        $or: [
          {
            name: new RegExp(searchQuery, 'i'),
          },
          {
            slug: new RegExp(searchQuery, 'i'),
          },
          {
            description: new RegExp(searchQuery, 'i'),
          },
        ],
      }
    }

    return await this.GenreModel.find(options)
      .select('-updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec()
  }

  async getCollections() {
    const genres = await this.getAllGenres()
    const collections = [genres]
    return collections
  }

  async getById(_id: string) {
    const genre = await this.GenreModel.findById(_id)
    if (!genre) {
      throw new NotFoundException('Genre not found')
    }

    return genre
  }

  async create() {
    const defaultGenre: CreateGenreDto = {
      description: '',
      name: '',
      slug: '',
      icon: '',
    }

    const genre = await this.GenreModel.create(defaultGenre)
    return genre._id
  }

  async update(_id: string, dto: CreateGenreDto) {
    return await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()
  }

  async delete(_id: string) {
    return await this.GenreModel.findByIdAndDelete(_id).exec()
  }
}
