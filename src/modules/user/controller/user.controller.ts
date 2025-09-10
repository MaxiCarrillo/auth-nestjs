import { JwtAccessAuthGuard } from '@/modules/auth/guards';
import { ApiVersionHeader } from '@/modules/common/decorators';
import { ApiStandardResponse } from '@/modules/common/decorators/api-response.decorator';
import { Body, ClassSerializerInterceptor, Controller, Get, Put, UseGuards, UseInterceptors } from '@nestjs/common';
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
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiStandardResponse({
        summary: 'Get all users',
        description: 'Endpoint to retrieve a list of all users in the system',
        type: UserResponseDTO,
        isArray: true,
    })
    async findAll(): Promise<UserResponseDTO[]> {
        const users = await this.userService.findAll();
        return plainToInstance(UserResponseDTO, users);
    }


    @Put('update')
    @UseGuards(JwtAccessAuthGuard)
    @ApiStandardResponse({
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
