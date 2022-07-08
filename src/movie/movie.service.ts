import { Injectable, NotFoundException, Type } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateMovieDto } from './dto/create-movie.dto'
import { MovieModel } from './movie.model'

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
  ) {}

  async getBySlug(slug: string) {
    const movie = await this.MovieModel.findOne({ slug })
      .populate('actors genres')
      .exec()
    if (!movie) {
      throw new NotFoundException('Movie not found')
    }
    return movie
  }

  async getByActor(actorId: Types.ObjectId) {
    const movies = await this.MovieModel.find({ actors: actorId }).exec()
    if (!movies) {
      throw new NotFoundException('Movie not found')
    }
    return movies
  }

  async getByGenres(genreIds: Types.ObjectId[]) {
    const movies = await this.MovieModel.find({
      genres: { $in: genreIds },
    }).exec()
    if (!movies) {
      throw new NotFoundException('Movie not found')
    }
    return movies
  }

  async getAllMovies(searchQuery?: string) {
    let options = {}

    if (searchQuery) {
      options = {
        $or: [
          {
            title: new RegExp(searchQuery, 'i'),
          },
        ],
      }
    }

    return await this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .populate('actors genres')
      .exec()
  }

  async getMostPopularMovies() {
    return await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec()
  }

  async updateCountOpened(slug: string) {
    return await this.MovieModel.findOneAndUpdate(
      { slug },
      { $inc: { countOpened: 1 } },
      { new: true }
    ).exec()
  }

  async getById(_id: string) {
    const movie = await this.MovieModel.findById(_id)
    if (!movie) {
      throw new NotFoundException('Movie not found')
    }

    return movie
  }

  async create() {
    const defaultMovie: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      description: '',
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    }

    const movie = await this.MovieModel.create(defaultMovie)
    return movie._id
  }

  async update(_id: string, dto: UpdateMovieDto) {
    return await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()
  }

  async delete(_id: string) {
    return await this.MovieModel.findByIdAndDelete(_id).exec()
  }
}
