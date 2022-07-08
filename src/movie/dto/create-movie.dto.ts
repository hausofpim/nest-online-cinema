import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator'

export class Parameters {
  @ApiProperty()
  @IsNumber()
  year: number

  @ApiProperty()
  @IsNumber()
  duration: number

  @ApiProperty()
  @IsString()
  country: string
}

export class UpdateMovieDto {
  @ApiProperty()
  @IsString()
  poster: string

  @ApiProperty()
  @IsString()
  bigPoster: string

  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsString()
  description: string

  @ApiProperty({ required: false })
  @IsObject()
  parameters?: Parameters

  @ApiProperty()
  @IsString()
  slug: string

  @ApiProperty()
  @IsString()
  videoUrl: string

  @ApiProperty()
  @IsArray()
  genres: string[]

  @ApiProperty()
  @IsArray()
  actors: string[]

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  isSendTelegram?: boolean
}
