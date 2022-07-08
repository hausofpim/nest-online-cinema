import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty()
  @IsString({
    message: 'This is not a string!',
  })
  refreshToken: string
}
