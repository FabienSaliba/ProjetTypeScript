import { Module } from '@nestjs/common';
import { GareController } from './gare.controller';
import { GareService } from './gare.service';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [GareController],
  providers: [GareService],
})
export class GareModule {}
