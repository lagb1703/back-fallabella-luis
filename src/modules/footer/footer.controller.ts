import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FooterService } from './footer.service';
@Controller('footer')
@ApiTags("Menus")
export class FooterController {
    constructor(private readonly footerService: FooterService) { }

    @Get('')
    async getFooterMenu() {
        return this.footerService.getFooterMenu()
    }
}
