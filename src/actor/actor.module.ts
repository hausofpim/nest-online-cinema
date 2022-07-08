import { Module } from '@nestjs/common'
import { ActorService } from './actor.service'
import { ActorController } from './actor.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { ActorModel } from './actor.model'
import { ConfigModule } from '@nestjs/config'

@Module({
  providers: [ActorService],
  controllers: [ActorController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ActorModel,
        schemaOptions: {
          collection: 'Actor',
        },
      },
    ]),
  ],
})
export class ActorModule {}
