import { Injectable, Logger } from '@nestjs/common';
import * as pg from 'pg'
import { databaseProvider } from '../../config/config.db.service';

@Injectable()
export class PostgreService {
  private readonly logger = new Logger(PostgreService.name);

  private readonly postgresdb:pg.Pool;

  constructor(){
    this.postgresdb = new pg.Pool(databaseProvider);
  }

  /**
   * Realiza una consulta SELECT en la base de datos.
   * @param sql La sentencia SQL que se utilizará para la consulta.
   * @param params Los parámetros de filtrado para la consulta. (Opcional)
   * @returns Los datos resultantes de la consulta.
   */
  async query(
    sql: string,
    params: Array<string | number>,
  ): Promise<pg.QueryResult<any>> {
    try {
      const result = await this.postgresdb.query<Promise<pg.QueryResult<any>>>(sql, params);

      // Log de las consultas
      const message = this.getLogMessage(sql, params)
        .replace(/\n|/g, '')
        .replace(/  +/g, ' ');
      this.logger.log(message);

      return result; //result?.rows ? result?.rows : null;
    } catch (err) {
      this.logger.error('Error in processing:\n', err);
    }
  }

  /**
   * Ejecuta un procedimiento almacenado en la base de datos.
   * @param sql Sentencia SQL para ejecutar el procedimiento almacenado.
   * @param params Parámetro con el contexto a insertar o actualizar.
   * @returns Devuelve el último ID insertado para el procedimiento "Guardar".
   */
  async procedure<T>(
    sql: string,
    params: T,
    id?: number | string,
  ): Promise<pg.QueryResult<any>> {
    try {
      /**
       * Crea un objeto que contiene los parámetros de enlace,
       * Se serializa en formato JSON Para el parametro CLOB
       * de la base de datos
       */
      const bindParams = [
        JSON.stringify(params),
        id ?? 0,
      ];
      if(params == null)
        bindParams.shift();

      /** Se conecta al pool de conexiones */

      /**
       * Para los procedimientos que ejecutan
       * (INSERT Y UPDATE) se construye el bindParams
       * con el contexto del objeto.
       * Para el (DELETE) solo se envía el Id de la tabla
       * ya que no se necesita un contexto del objeto
       */
      const result = await this.postgresdb.query<Promise<pg.QueryResult<any>>>(
        sql,
        bindParams
      );

      /** Log de las consultas */
      const message = this.getLogMessage(
        sql,
        bindParams,
      )
        .replace(/\n|/g, '')
        .replace(/  +/g, ' ');
      this.logger.log(message);

      return result;
    } catch (err) {
      this.logger.error('Error in processing:\n', err);
    }
  }

  getLogMessage(query: string, params?: unknown[]) {
    const PARAMS = JSON.stringify(params);
    if (!params) {
      return `Query: ${query}`;
    }
    return `Query: ${query} Params: ${(PARAMS.length >= 100)?`${PARAMS.substring(0, 100)}...(more than 100)...${PARAMS.substring(PARAMS.length-100, PARAMS.length)}`:PARAMS}`;
  }
}
