import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FileUploadDto } from './dto/file-upload.dto'
import { FileService } from './file.service'

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Выберите файл',
    type: FileUploadDto,
  })
  @ApiParam({
    name: 'folder',
    required: false,
  })
  @ApiOperation({ summary: 'Загрузить файл на сервер' })
  @ApiBearerAuth()
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string
  ) {
    return await this.fileService.saveFiles([file], folder)
  }
}
