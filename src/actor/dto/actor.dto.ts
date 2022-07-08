import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ActorDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  slug: string

  @ApiProperty()
  @IsString()
  photo: string
}
