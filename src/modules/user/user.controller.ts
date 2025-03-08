import {
    Body,
    Controller,
    Get,
    Param,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from './../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { DocumentTypeInterface, UserInterface } from './interfaces';
import { UserDto } from './dtos';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @UseGuards(AuthGuard)
    @Get('')
    getUserById(@Request() req: Request): Promise<UserInterface> {
        return this.userService.getUserById(req);
    }

    @Get('documentsTypes')
    getDocumentsTypes(): Promise<Array<DocumentTypeInterface>> {
        return this.userService.getDocumentsTypes();
    }

    @Post("")
    saveUser(@Body() user: UserDto): Promise<number> {
        return this.userService.saveUser(user);
    }


}
