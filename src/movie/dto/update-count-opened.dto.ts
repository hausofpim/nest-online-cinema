import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class updateCountOpenedDto {
  @ApiProperty()
  @IsString()
  slug: string
}
