import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { JWT_ACCESS_SECRET } from 'src/core/config';
import { GoogleProfile } from 'src/modules/auth/interfaces';
import { JwtPayload } from 'src/modules/auth/types';
import { CreateUserDto } from '../dtos';
import { UserResponseDTO } from '../dtos/user-response.dto';
import { User } from '../schemas';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async findAll(): Promise<User[]> {
        return this.userModel.find().lean();
    }

    async findByEmail(email: string): Promise<UserResponseDTO | null> {
        const user = await this.userModel.findOne({ email }).lean();
        if (!user) return null;
        return plainToInstance(UserResponseDTO, user, {
            excludeExtraneousValues: true,
        });
    }

    async findUserByToken(accessToken: string): Promise<UserResponseDTO | null> {
        const payload: JwtPayload = this.jwtService.verify(accessToken, { secret: JWT_ACCESS_SECRET });
        const user = await this.userModel.findOne({ email: payload.email }).lean();
        return user ? plainToInstance(UserResponseDTO, user, {
            excludeExtraneousValues: true,
        }) : null;
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).lean();
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async createOrFindGoogleUser(user: GoogleProfile): Promise<User> {
        const existingUser = await this.userModel.findOne({ email: user.emails[0].value }).exec();
        if (existingUser) {
            if (!existingUser.googleId) {
                existingUser.googleId = user.id;
                await existingUser.save();
            }
            return existingUser;
        } else {
            const createdUser = new this.userModel({
                email: user.emails[0].value,
                name: user.displayName,
                googleId: user.id
            });
            return createdUser.save();
        }
    }

}
