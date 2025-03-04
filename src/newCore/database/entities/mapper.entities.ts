/**
 * Permite mapear el nombre de la tabla de la base de datos a una clase
 * @param tableName Nombre de la tabla de la base de datos
 * @returns Una funcion con el nombre de la tabla
 */
export function Table(tableName: string) {
  return function(target: any) {
    target.tableName = tableName;
  }
}

/**
 * Permite mapear el nombre de la columna de la base de datos a una clase
 * @param name Nombre de la columna de la base de datos
 * @returns Una funcion con el nombre de la columna
 */
export function Column(name: string) {
  return function(target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[name];
      },
      set(value: any) {
        this[name] = value;
      }
    });
  }
}
