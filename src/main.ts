import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';

async function seedAdmin(prisma: PrismaService) {
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.employee.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await prisma.employee.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get PrismaService instance
  const prisma = app.get(PrismaService);
  
  // Seed admin user
  await seedAdmin(prisma);

   app.enableCors({
    origin: 'http://localhost:5173',  
    credentials: true,                
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
