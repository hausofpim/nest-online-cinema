import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
  ) {}

  async getById(_id: string) {
    const user = await this.UserModel.findById(_id)
    if (!user) {
      throw new NotFoundException('User not found!')
    }

    return user
  }

  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.getById(_id)

    const sameUserByEmail = await this.UserModel.findOne({ email: dto.email })
    if (sameUserByEmail && String(_id) !== String(sameUserByEmail._id)) {
      throw new NotFoundException('Email is busy')
    }

    if (dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }

    user.email = dto.email

    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin
    }

    await user.save()
    return
  }

  async getCount() {
    return await this.UserModel.find().count().exec()
  }

  async getAllUsers(searchQuery?: string) {
    let options = {}

    if (searchQuery) {
      options = {
        $or: [
          {
            email: new RegExp(searchQuery, 'i'),
          },
        ],
      }
    }

    return await this.UserModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .exec()
  }

  async deleteUser(_id: string) {
    return this.UserModel.findByIdAndDelete(_id).exec()
  }

  async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {}
}
