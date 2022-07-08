import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { IdValidationPipe } from 'src/pipes/id-validation.pipe'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  @ApiBearerAuth()
  async getProfile(@User('_id') _id: string) {
    return this.userService.getById(_id)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  @ApiBearerAuth()
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto)
  }

  @Get('count')
  @Auth('admin')
  @ApiBearerAuth()
  async getCountUsers() {
    return this.userService.getCount()
  }

  @Get('')
  @Auth('admin')
  @ApiBearerAuth()
  async getUsers(@Query('searchQuery') searchQuery?: string) {
    return this.userService.getAllUsers(searchQuery)
  }

  @Get(':id')
  @Auth('admin')
  @ApiBearerAuth()
  async getUserProfile(@Param('id', IdValidationPipe) _id: string) {
    return this.userService.getById(_id)
  }

  @ApiBody({ type: UpdateUserDto })
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async updateUser(
    @Param('id', IdValidationPipe) _id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.updateProfile(_id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  @ApiBearerAuth()
  async deleteUser(@Param('id', IdValidationPipe) _id: string) {
    return this.userService.deleteUser(_id)
  }
}
