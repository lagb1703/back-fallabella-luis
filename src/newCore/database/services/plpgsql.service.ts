import { Injectable, Logger } from '@nestjs/common';
import { PostgreService } from './index';
import { plainToClass } from 'class-transformer';

type ExecuteQueryResult<T> = Promise<T[]>;

@Injectable()
export class PlpgsqlService {
  private readonly logger = new Logger(PlpgsqlService.name);

  constructor(private postgres: PostgreService) {}

  /**
   * ( EJECUTA SELECT ) en la base de datos.
   * @param sql La sentencia SQL que se utilizará para la consulta.
   * @param params Los parámetros de filtrado para la consulta. (Opcional)
   * @param resultClass El modelo de la clase que se desea mapear
   * @returns Los datos mapeados resultantes de la consulta.
   */
  async executeQuery<T>(
    query: string,
    param: Array<string | number>,
    resultClass?: new (param: any) => T,
  ): ExecuteQueryResult<T> {
    try {
      const result = await this.postgres.query(query, param);
      const items = result?.rows.map((row) => plainToClass(resultClass, row));
      return items;
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  /**
   * ( EJECUTA VIEW ) de una base de datos
   * @param sql La sentencia SQL que se utilizará para la consulta.
   * @param params Los parámetros de filtrado para la consulta. (Opcional)
   * @returns Los datos resultantes de la vista.
   */
  async executeView<T>(
    query: string,
    param: Array<string | number>,
  ): ExecuteQueryResult<T> {
    try {
      const result = await this.postgres.query(query, param);
      return result.rows ? <T[]>result.rows : null;
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  /**
   * Ejecuta un procedimiento almacenado para guardar información en la base de datos.
   * @param query Sentencia SQL para ejecutar el procedimiento almacenado.
   * @param dataJson Datos en formato JSON a insertar o actualizar.
   * @returns Devuelve el último ID insertado como número o una cadena de texto.
   */
  async executeProcedureSave<T>(
    query: string,
    dataJson: T,
  ): Promise<Object> {
    try {
      const result = await this.postgres.procedure(query, dataJson);
      return result.rows[0];
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  /**
   * Ejecuta un procedimiento almacenado para actualizar información en la base de datos.
   * @param query Sentencia SQL para ejecutar el procedimiento almacenado.
   * @param dataJson Datos en formato JSON a actualizar.
   * @param id ID del registro a actualizar.
   * @returns Devuelve un objeto con el resultado de la operación de actualización.
   */
  async executeProcedureUpdate<T>(
    query: string,
    dataJson: T,
    id: number,
  ): Promise<object> {
    try {
      return await this.postgres.procedure(query, dataJson, id);
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }

  /**
   * Ejecuta un procedimiento almacenado para eliminar información de la base de datos.
   * @param query Sentencia SQL para ejecutar el procedimiento almacenado.
   * @param id ID del registro a eliminar.
   * @returns No devuelve ningún valor.
   */
  async executeProcedureDelete(query: string, id: number): Promise<void> {
    try {
      await this.postgres.procedure(query, null, id);
    } catch (err) {
      this.logger.error(err);
      throw Error(err);
    }
  }
}
