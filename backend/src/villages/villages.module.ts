import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Village } from './entities/village.entity';
import { VillagesService } from './services/villages.service';
import { VillagesController } from './villages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Village])],
  controllers: [VillagesController],
  providers: [VillagesService],
  exports: [VillagesService, TypeOrmModule],
})
export class VillagesModule {}
