import { Module } from '@nestjs/common';
import { ComputerController } from './computer.controller';
import { DiskModule } from '../disk/disk.module';
import { CpuModule } from '../cpu/cpu.module';

@Module({
  imports: [DiskModule, CpuModule],
  controllers: [ComputerController],
})
export class ComputerModule {}
