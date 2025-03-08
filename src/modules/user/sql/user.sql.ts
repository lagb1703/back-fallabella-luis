export enum UserSql {
  /**
   * @Querys Seccion solo para las consultas de tipo
   * SELECT
   */
  getDocumentsTypes = `
            SELECT
              ttd."tipoDocumento_id" AS "documentTypeId",
              ttd.nombre AS "name",
              ttd.iniciales AS "initials"
            FROM usuarios."TB_TipoDocumentos" ttd
      `,
  getUserById = `
            SELECT
              tu.usuario_id AS "userId",
              tu.nombres AS "names",
              tu.apellidos AS "lastNames",
              tu.correo AS "email",
              (tu.identificador::VARCHAR) AS "identification",
              tu."puntosCMR" AS "cmrPoints",
              tu.celular AS "phone",
              tu.contrasena AS "password",
              tu.vendedor AS "isSeller",
              tu."tipoDocumento_id" AS "documentTypeId",
              ttd."nombre" AS "documentType"
            FROM usuarios."TB_Usuarios" tu
            INNER JOIN usuarios."TB_TipoDocumentos" ttd
              ON tu."tipoDocumento_id" = ttd."tipoDocumento_id"
            WHERE tu.usuario_id = $1
    `,
  getUserAcountByEmailAndPassword = `
            SELECT
              tu.usuario_id AS "userId",
              tu.correo AS "email",
              tu.contrasena AS "password"
            FROM usuarios."TB_Usuarios" tu
            INNER JOIN usuarios."TB_TipoDocumentos" ttd
              ON tu."tipoDocumento_id" = ttd."tipoDocumento_id"
            WHERE tu.correo = $1 AND tu.contrasena = $2
  `,
  /**
   * @Actions Seccion solo para las consultas de tipo
   * INSERT, UPDATE, DELETE, POCEDURES
   */
  saveUser = `
            CALL usuarios."SP_USU_USUARIOSPKG_CREARUSUARIO"($1, $2)
  `,
}
