export enum SqlEnterprise {
  /**
   * @Querys Seccion solo para las consultas de tipo
   * SELECT
   */
  getEnterprise = `
    SELECT * 
    FROM TB_DEMO_EMPRESAS
  `,

  getEnterpriseById = `
    SELECT *
    FROM TB_DEMO_EMPRESAS TIE 
    WHERE TIE.IDEMPRESA = :0  
  `,

  getEmployeesCompanies = `
    SELECT *
    FROM VI_DEMO_TRABAJADORESEMPRESAS
  `,

  /**
   * @Actions Seccion solo para las consultas de tipo
   * INSERT, UPDATE, DELETE, POCEDURES
   */
  saveEnterprise = `
    BEGIN
      PKG_DEMO_QUERYS.SP_DEMOGUARDAREMPRESA(:dataJson, :id);
    END;
  `,
  updateEnterprise = `
    BEGIN
      PKG_DEMO_QUERYS.SP_DEMOMODIFICARREMPRESA(:dataJson, :id);
    END;
  `,
  deleteEnterprise = `
    BEGIN
      PKG_DEMO_QUERYS.SP_DEMOELIMINARREMPRESA(:id);
    END;
  `,
}
