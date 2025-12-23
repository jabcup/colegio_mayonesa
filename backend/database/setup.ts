import 'reflect-metadata';
import { DataSource } from 'typeorm';

const setupDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3308,
  username: 'root',
  password: '7090158',
  database: 'colegio',
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../src/**/*.entity.{ts,js}'],
});

setupDataSource
  .initialize()
  .then(async () => {
    console.log('✅ Base de datos sincronizada correctamente');
    await setupDataSource.destroy();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
    process.exit(1);
  });
