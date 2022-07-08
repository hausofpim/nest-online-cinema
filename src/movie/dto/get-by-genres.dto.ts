import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

export class getByGenresDto {
  @ApiProperty()
  @IsArray()
  genreIds: string[]
}
