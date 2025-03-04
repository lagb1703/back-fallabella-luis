import { Exclude, Expose } from 'class-transformer';

export class EnterpriseEntity {
  @Expose({ name: 'IDEMPRESA' })
  enterpriseId: number;

  @Expose({ name: 'EMPRESA' })
  enterprise: string;

  @Expose({ name: 'NIT' })
  nit: string;

  @Expose({ name: 'TELEFONO' })
  phone: string;

  @Expose({ name: 'PAGINAWEB' })
  website: string;

  @Expose({ name: 'DIRECCION' })
  address: string;

  @Exclude()
  FECHACREACION: Date;

  @Expose({ name: 'ACTIVO' })
  isActive: number;
}

export type Enterprise = Omit<EnterpriseEntity, 'FECHACREACION'>;
