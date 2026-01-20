import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IdpService } from './idp.service';

@Module({
  imports: [HttpModule],
  providers: [IdpService],
  exports: [IdpService],
})
export class IdpModule {}
