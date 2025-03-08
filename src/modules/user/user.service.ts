import { Injectable, Logger } from '@nestjs/common';
import { PlpgsqlService } from 'src/newCore/database/services';
import { DocumentTypeInterface, UserInterface, UserCountInterface } from './interfaces';
import { UserDto } from './dtos';
import { UserSql } from './sql/user.sql';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        private readonly plpgsqlService: PlpgsqlService
    ) { }

    async getDocumentsTypes(): Promise<DocumentTypeInterface[]> {
        try {
            return await this.plpgsqlService.executeQuery<DocumentTypeInterface>(
                UserSql.getDocumentsTypes,
                []
            );
        } catch (err) {
            this.logger.error(err);
            throw Error(err);
        }
    }

    async getUserById(id: string): Promise<UserInterface> {
        try {
            return (await this.plpgsqlService.executeQuery<UserInterface>(
                UserSql.getUserById,
                [id]
            ))[0];
        } catch (err) {
            this.logger.error(err);
            throw Error(err);
        }
    }

    async getUserAcountByEmailAndPassword(email: string, password: string): Promise<UserCountInterface> {
        try {
            const result: UserCountInterface = (await this.plpgsqlService.executeQuery<UserCountInterface>(
                UserSql.getUserAcountByEmailAndPassword,
                [email, password]
            ))[0];
            if (result) {
                result.email = email;
                result.password = password;
                return result;
            }
            return null;
        } catch (err) {
            this.logger.error(err);
            throw Error(err);
        }
    }

    async saveUser(user: UserDto): Promise<number> {
        try {
            return (await this.plpgsqlService.executeProcedureSave<UserDto>(
                UserSql.saveUser,
                user
            ))["p_id"];
        } catch (err) {
            this.logger.error(err);
            throw Error(err);
        }
    }
}
