import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FileController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/:filename')
  async getFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res,
  ) {
    const fileType = filename.split('.').pop();
    let contentType = 'text/plain';

    if (fileType) {
      contentType = `image/${fileType}`;
    }

    if (fileType === 'svg') {
      contentType = 'image/svg+xml';
    }

    if (fileType === 'html') {
      contentType = 'text/html';
    }

    res.set({
      'Content-Type': contentType,
    });

    const filePath = join(
      process.cwd(),
      `${this.configService.get('UPLOADED_FILE_PATH')}${filename}`,
    );

    const readStream = createReadStream(filePath);
    readStream.on('error', (err) => {
      console.error(err);
    });

    return new StreamableFile(readStream);
  }
}
