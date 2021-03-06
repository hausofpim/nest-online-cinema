import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'
import { hash, genSalt, compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: AuthDto) {
    await this.isUserIssetByEmail(dto.email)

    const passwordSalt = await genSalt()
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, passwordSalt),
    })
    await newUser.save()

    const tokens = await this.issueTokens(String(newUser._id))

    return {
      user: this.getUserData(newUser),
      ...tokens,
    }
  }

  private async isUserIssetByEmail(email: string) {
    const user = await this.UserModel.findOne({ email })
    if (user) {
      throw new BadRequestException('User already isset!')
    }
  }

  async login(dto: AuthDto) {
    const user = await this.UserModel.findOne({ email: dto.email })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const isValidPassword = await compare(dto.password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password')
    }

    const tokens = await this.issueTokens(String(user._id))

    return {
      user: this.getUserData(user),
      ...tokens,
    }
  }

  private async issueTokens(userId: string) {
    const data = {
      _id: userId,
    }

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    })

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    })

    return {
      refreshToken,
      accessToken,
    }
  }

  private getUserData(user: UserModel) {
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    }
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException('Please sign in')
    }

    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException('Invalid token')
    }

    const user = await this.UserModel.findById(result._id)
    const tokens = await this.issueTokens(String(user._id))

    return {
      user: this.getUserData(user),
      ...tokens,
    }
  }
}
