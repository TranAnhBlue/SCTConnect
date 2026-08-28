import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';
        const isSsl = configService.get<string>('DB_SSL') === 'true';

        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbDatabase = configService.get<string>('DB_DATABASE');

        if (isProd) {
          if (!dbPassword) {
            throw new Error(
              'Biến môi trường DB_PASSWORD là bắt buộc trong môi trường production',
            );
          }
          if (!dbDatabase) {
            throw new Error(
              'Biến môi trường DB_DATABASE là bắt buộc trong môi trường production',
            );
          }
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: dbPassword || (isProd ? '' : 'postgres'),
          database: dbDatabase || (isProd ? '' : 'sct_connect'),

          autoLoadEntities: true,
          synchronize: false,
          logging: configService.get<string>('NODE_ENV') === 'development',

          ssl: isSsl ? { rejectUnauthorized: false } : false,

          extra: {
            max: 20,
            idleTimeoutMillis: 30000,
            ssl: isSsl ? { rejectUnauthorized: false } : undefined,
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
