import { Injectable, Logger } from '@nestjs/common';
import * as mg from "mongodb"
import { databaseProvider, URI } from '../../config/config.db.service';
import { Configuration } from './../../config/config.key';
import { ConfigService } from './../../config/config.service';

@Injectable()
export class MongoService {
    private readonly logger = new Logger(MongoService.name);

    private readonly mongodb: mg.MongoClient;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.mongodb = new mg.MongoClient(URI);
    }

    /**
     * Realiza una consulta find en la base de datos.
     * @param collection La colección que se va a consultar.
     * @param filters Los parámetros de filtrado para la consulta. (Opcional)
     * @param projections La proyeccion de la consulta. (Opcional)
     * @returns El cursor de la consulta.
     */
    async query(
        collection: string,
        filters?: mg.Filter<mg.Document>,
        projections?: mg.FindOptions<mg.Document>
    ): Promise<mg.WithId<mg.BSON.Document>[]> {
        try {
            console.log(-1)
            await this.mongodb.connect();
            const db = this.mongodb.db(this.configService.get(Configuration.MONGODATABASE));
            const cn = db.collection(collection);
            const document = cn.find(filters, projections);
            const message = this.getLogMessage(collection, filters, projections)
                .replace(/\n|/g, '')
                .replace(/  +/g, ' ');
            this.logger.log(message);
            console.log(document);
            return document.toArray();
        } catch (err) {
            this.logger.error('Error in processing:\n', err);
        }
    }

    /**
     * Ejecuta un insertOne en la base de datos.
     * @param collection La colección que se va a guardar el documento.
     * @param document Documento a guardar.
     * @param options Las opciones de guardado. (opcional)
     * @returns Devuelve el objectId del documento guardado
     */
    async insert<T extends object>(
        collection: string,
        document: T,
        options?: mg.InsertOneOptions
    ): Promise<mg.BSON.ObjectId> {
        try {

            await this.mongodb.connect();
            const db: mg.Db = this.mongodb.db()
            const cn: mg.Collection = db.collection(collection);
            const result = await cn.insertOne(document, options);
            const message = this.getLogMessage(collection, document, options)
                .replace(/\n|/g, '')
                .replace(/  +/g, ' ');
            this.logger.log(message);
            if (!result.acknowledged)
                throw Error("Algo fallo en la consulta")
            return result.insertedId;
        } catch (err) {
            this.logger.error('Error in processing:\n', err);
        }
    }

    /**
     * Ejecuta un updateMany en la base de datos.
     * @param collection La colección que se va a actualizar el documento.
     * @param document Documento a actualizar.
     * @param filters Los parámetros de filtrado para la consulta. 
     * @param options Las opciones de guardado. (opcional)
     * @returns Devuelve elobjectId
     */
    async update<T extends object>(
        collection: string,
        document: T,
        filters: mg.Filter<mg.BSON.Document>,
        options?: mg.UpdateOptions
    ): Promise<mg.BSON.ObjectId> {
        try {

            await this.mongodb.connect();
            const db: mg.Db = this.mongodb.db()
            const cn: mg.Collection = db.collection(collection);
            const result = await cn.updateMany(filters, document, options)
            const message = this.getLogMessage(collection, filters, options)
                .replace(/\n|/g, '')
                .replace(/  +/g, ' ');
            this.logger.log(`Se editaron ${result.upsertedCount} Bjson`);
            this.logger.log(message);
            if (!result.acknowledged)
                throw Error("Algo fallo en la consulta")
            return result.upsertedId;
        } catch (err) {
            this.logger.error('Error in processing:\n', err);
        }
    }

    /**
     * Ejecuta un deleteMany en la base de datos.
     * @param collection Sentencia SQL para ejecutar el procedimiento almacenado.
     * @param filters Los parámetros de filtrado para la consulta.
     * @param options Las opciones de guardado. (opcional)
     * @returns NO retorna nada
     */
    async delete(
        collection: string,
        filters: mg.Filter<mg.BSON.Document>,
        options?: mg.DeleteOptions
    ): Promise<any> {
        try {

            await this.mongodb.connect();
            const db: mg.Db = this.mongodb.db()
            const cn: mg.Collection = db.collection(collection);
            const result = await cn.deleteMany(filters, options)
            const message = this.getLogMessage(collection, filters, options)
                .replace(/\n|/g, '')
                .replace(/  +/g, ' ');
            this.logger.log(`Se eliminaron ${result.deletedCount} Bjson`);
            this.logger.log(message);
            if (!result.acknowledged)
                throw Error("Algo fallo en la consulta")
        } catch (err) {
            this.logger.error('Error in processing:\n', err);
        }
    }

    private getLogMessage(collection: string, filters?: object, projections?: object): string {
        const FILTERS = JSON.stringify(filters);
        const PROJECTIONS = JSON.stringify(projections)
        if (!filters && !projections)
            return `Collection: ${collection}`;
        if (filters && !projections)
            return `Colección: ${collection} Filtro: ${(FILTERS.length >= 100) ? `${FILTERS.substring(0, 100)}...(more than 100)...${FILTERS.substring(FILTERS.length - 100, FILTERS.length)}` : FILTERS}`;
        if (!filters && projections)
            return `Colección: ${collection} Projecciones: ${(PROJECTIONS.length >= 100) ? `${PROJECTIONS.substring(0, 100)}...(more than 100)...${PROJECTIONS.substring(PROJECTIONS.length - 100, PROJECTIONS.length)}` : PROJECTIONS}`;
        return `Colección: ${collection} ` +
            `Filtro: ${(FILTERS.length >= 100) ? `${FILTERS.substring(0, 100)}...(more than 100)...${FILTERS.substring(FILTERS.length - 100, FILTERS.length)}` : FILTERS}` +
            ` Projecciones: ${(PROJECTIONS.length >= 100) ? `${PROJECTIONS.substring(0, 100)}...(more than 100)...${PROJECTIONS.substring(PROJECTIONS.length - 100, PROJECTIONS.length)}` : PROJECTIONS}`;
    }
}
