import { Injectable, Logger } from '@nestjs/common';
import { PlpgsqlService } from './../../newCore/database/services';
import { EmployeeCompany } from './interfaces';
import { SqlEnterprise } from './sql/enterprise.sql';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dtos';
import { EnterpriseEntity, Enterprise } from './entities/enterprise.entity';

@Injectable()
export class EnterpriseService {
  private readonly logger = new Logger(EnterpriseService.name);

  constructor(private readonly plpgsqlService: PlpgsqlService) {}

  /**
   * Obtiene todas las empresas de la tabla en la base de datos
   * @returns Los registros con la información de las empresas
   */
  async getEnterprise(): Promise<Enterprise[]> {
    try {
      return await this.plpgsqlService.executeQuery<EnterpriseEntity>(
        SqlEnterprise.getEnterprise,
        [],
        EnterpriseEntity,
      );
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  async getEnterpriseById(enterpriseId: number): Promise<Enterprise[]> {
    try {
      return await this.plpgsqlService.executeQuery<EnterpriseEntity>(
        SqlEnterprise.getEnterpriseById,
        [enterpriseId],
        EnterpriseEntity,
      );
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  async getEmployeesCompanies(): Promise<EmployeeCompany[]> {
    try {
      return await this.plpgsqlService.executeView<EmployeeCompany>(
        SqlEnterprise.getEmployeesCompanies,
        [],
      );
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  async saveEnterprise(
    enterprise: CreateEnterpriseDto,
  ): Promise<number | string> {
    try {
      return await this.plpgsqlService.executeProcedureSave(
        SqlEnterprise.saveEnterprise,
        enterprise,
      );
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  async updateEnterprise(
    enterprise: UpdateEnterpriseDto,
    enterpriseId: number,
  ): Promise<Enterprise> {
    try {
      await this.plpgsqlService.executeProcedureUpdate(
        SqlEnterprise.updateEnterprise,
        enterprise,
        enterpriseId,
      );
      return { enterpriseId, ...enterprise };
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  async deleteEnterprise(enterpriseId: number): Promise<void> {
    try {
      this.plpgsqlService.executeProcedureDelete(
        SqlEnterprise.deleteEnterprise,
        enterpriseId,
      );
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }
}
