import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ActorModel } from './actor.model'
import { ActorDto } from './dto/actor.dto'

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
  ) {}

  async getBySlug(slug: string) {
    return await this.ActorModel.findOne({ slug }).exec()
  }

  async getAllActors(searchQuery?: string) {
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
        ],
      }
    }

    return await this.ActorModel.aggregate()
      .match(options)
      .lookup({
        from: 'Movie',
        localField: '_id',
        foreignField: 'actors',
        as: 'movies',
      })
      .addFields({
        countMovies: {
          $size: '$movies',
        },
      })
      .project({
        __v: 0,
        updatedAt: 0,
        movies: 0,
      })
      .sort({
        createdAt: 'desc',
      })
      .exec()
  }

  async getById(_id: string) {
    const actor = await this.ActorModel.findById(_id)
    if (!actor) {
      throw new NotFoundException('Genre not found')
    }

    return actor
  }

  async create() {
    const defaultGenre: ActorDto = {
      name: '',
      slug: '',
      photo: '',
    }

    const actor = await this.ActorModel.create(defaultGenre)
    return actor._id
  }

  async update(_id: string, dto: ActorDto) {
    return await this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()
  }

  async delete(_id: string) {
    return await this.ActorModel.findByIdAndDelete(_id).exec()
  }
}
