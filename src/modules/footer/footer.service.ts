import { Injectable, Logger } from '@nestjs/common';
import { MongoService } from './../../mongoCore/database/services';
import { SubMenu } from './interfaces';

@Injectable()
export class FooterService {
    private readonly logger: Logger = new Logger(FooterService.name);
    constructor(private readonly mongoService:MongoService){}

    async getFooterMenu(): Promise<Array<SubMenu>>{
        try{
            const result = this.mongoService.query("CO_FooterMenu");
            return result as any as Array<SubMenu>;
        }catch(err){
            this.logger.log(err);
            throw Error(err);
        }
    }
}
