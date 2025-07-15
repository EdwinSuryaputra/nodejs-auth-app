import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const port = process.env.PORT ?? 3000

	const config = new DocumentBuilder()
		.setTitle('My API')
		.setDescription('The API docs')
		.setVersion('1.0')
		.addBearerAuth() // optional: for JWT
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);

	await app.listen(port, () => {
		console.log(`Auth service is running on ${port}`)
	});
}
bootstrap();
