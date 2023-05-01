import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { FileModule } from './modules/file/file.module';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    SubscriptionModule,
    TransactionModule,
    FileModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
