import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './infrastructure/guards/auth.guard';
import { RolePermissionModule } from './infrastructure/modules/role-permission.module';
import { MenuModule } from './infrastructure/modules/menu.module';
import { AuthModule } from './infrastructure/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'wms_db'),
        entities: [join(__dirname, 'core', 'domain', 'entities', '*.entity.{ts,js}')],
        synchronize: configService.get('NODE_ENV', 'development') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RolePermissionModule,
    MenuModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
