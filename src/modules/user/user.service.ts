import { Injectable, Logger, Request } from '@nestjs/common';
import { PlpgsqlService } from 'src/newCore/database/services';
import { DocumentTypeInterface, UserInterface, UserAcountInterface } from './interfaces';
import { UserDto } from './dtos';
import { UserSql } from './sql/user.sql';
import * as Bcrypt from 'bcrypt';

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

    async getUserById(request:Request): Promise<UserInterface> {
        try {
            const {userId, ...result} = request['user'] as (UserAcountInterface & {iat: number, exp: number});
            return (await this.plpgsqlService.executeQuery<UserInterface>(
                UserSql.getUserById,
                [userId]
            ))[0];
        } catch (err) {
            this.logger.error(err);
            throw Error(err);
        }
    }

    async getUserAcountByEmail(email: string): Promise<UserAcountInterface> {
        try {
            const result: UserAcountInterface = (await this.plpgsqlService.executeQuery<UserAcountInterface>(
                UserSql.getUserAcountByEmail,
                [email]
            ))[0];
            return result;
        } catch (err) {
            this.logger.error(err);
            throw Error(err);
        }
    }

    async saveUser(user: UserDto): Promise<number> {
        try {
            const hashedPassword = await Bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
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
