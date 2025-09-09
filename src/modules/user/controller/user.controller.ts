import { JwtAccessAuthGuard } from '@/modules/auth/guards';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from '../dtos';
import { User } from '../schemas';
import { UserService } from '../services';
import { ApiVersionHeader } from '@/modules/common/decorators';

@ApiVersionHeader()
@Controller({ path: 'user', version: '1' })
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(JwtAccessAuthGuard)
    @ApiOperation({
        summary: 'Get all users',
        description: 'Endpoint to retrieve a list of all users in the system',
    })
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }


    @Post('update')
    @UseGuards(JwtAccessAuthGuard)
    @ApiOperation({
        summary: 'Update an existing user',
        description: 'Endpoint to update an existing user in the system',
    })
    async update(
        @Body() updateUserDto: UpdateUserDto
    ) {
        return {
            message: 'User updated successfully',
            user: updateUserDto,
        };
    }
}
