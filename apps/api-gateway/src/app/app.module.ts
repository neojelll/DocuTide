import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { DocsEditorModule } from './docs-editor/docs-editor.module';
import { ProjectsModule } from './projects/projects.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.API_TTL),
        limit: Number(process.env.API_LIMIT),
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    ProjectsModule,
    DocsEditorModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
