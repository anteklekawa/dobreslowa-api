import { Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PostsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService, AppModule],
  exports: [AppService]
})
export class AppModule {}
