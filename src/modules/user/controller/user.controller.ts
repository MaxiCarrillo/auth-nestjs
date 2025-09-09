import { JwtAccessAuthGuard } from '@/modules/auth/guards';
import { ApiVersionHeader } from '@/modules/common/decorators';
import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto, UserResponseDTO } from '../dtos';
import { UserService } from '../services';

@ApiVersionHeader()
@Controller({ path: 'user', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(JwtAccessAuthGuard)
    @ApiOperation({
        summary: 'Get all users',
        description: 'Endpoint to retrieve a list of all users in the system',
    })
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(): Promise<UserResponseDTO[]> {
        const users = await this.userService.findAll();
        return plainToInstance(UserResponseDTO, users);
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
