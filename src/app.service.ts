import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): Object {
    return {text: 'Hello kek'}
  }
}
