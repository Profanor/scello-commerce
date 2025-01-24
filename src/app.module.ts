import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';

@Module({
  imports: [ProductModule, ThrottlerModule.forRoot([{ ttl: 60, limit: 10 }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
