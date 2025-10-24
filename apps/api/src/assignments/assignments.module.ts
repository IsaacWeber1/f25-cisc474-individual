import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [UsersModule],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, PrismaService],
})
export class AssignmentsModule {}