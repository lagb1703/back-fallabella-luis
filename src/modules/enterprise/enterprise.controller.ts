import { Controller, Get } from '@nestjs/common';
import { Body, Param, Post, Patch, Delete } from '@nestjs/common/decorators';
import { EnterpriseService } from './enterprise.service';
import { EmployeeCompany } from './interfaces';
import { Enterprise } from './entities/enterprise.entity';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dtos';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get()
  getEnterprise(): Promise<Enterprise[]> {
    return this.enterpriseService.getEnterprise();
  }

  @Get('employeescompanies')
  getEmployeesCompanies(): Promise<EmployeeCompany[]> {
    return this.enterpriseService.getEmployeesCompanies();
  }

  @Get(':id')
  getEnterpriseById(@Param('id') enterpriseId: number): Promise<Enterprise[]> {
    return this.enterpriseService.getEnterpriseById(enterpriseId);
  }

  @Post()
  saveEnterprise(
    @Body() enterprise: CreateEnterpriseDto,
  ): Promise<number | string> {
    return this.enterpriseService.saveEnterprise(enterprise);
  }

  @Patch(':id')
  updateEnterprise(
    @Param('id') enterpriseId: number,
    @Body() enterprise: UpdateEnterpriseDto,
  ): Promise<Enterprise> {
    return this.enterpriseService.updateEnterprise(enterprise, enterpriseId);
  }

  @Delete(':id')
  deleteEnterprise(@Param('id') enterpriseId: number): Promise<void> {
    return this.enterpriseService.deleteEnterprise(enterpriseId);
  }
}
