import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({ required: false })
  password?: string

  @ApiProperty({ required: false, default: false })
  @ApiProperty()
  isAdmin?: boolean
}
