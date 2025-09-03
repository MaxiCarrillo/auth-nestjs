import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from 'src/modules/auth/guards';
import { UpdateUserDto } from '../dtos';

@Controller('user')
export class UserController {

    @Post('update')
    @UseGuards(JwtAccessAuthGuard)
    @ApiOperation({
        summary: 'Actualizar un usuario existente',
        description: 'Endpoint para actualizar un usuario existente en el sistema',
    })
    async update(
        @Body() updateUserDto: UpdateUserDto
    ) {
        return {
            message: 'Usuario actualizado correctamente',
            user: updateUserDto,
        };
    }

}
