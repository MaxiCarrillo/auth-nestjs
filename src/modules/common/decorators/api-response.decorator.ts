import { applyDecorators, Type } from "@nestjs/common";
import { ApiOperation, ApiResponse, getSchemaPath } from "@nestjs/swagger";

interface ApiResponseOptions {
    summary: string;
    description?: string;
    type?: Type<any>;
    status?: number;
}

export function ApiStandardResponse(options: ApiResponseOptions) {
    const { summary, description, type, status = 200 } = options;

    const metadataSchema = {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: status },
            timestamp: { type: 'string', example: new Date().toISOString() },
            path: { type: 'string', example: '/api/example' },
        },
    };

    return applyDecorators(
        ApiOperation({ summary, description }),
        ApiResponse({
            status,
            schema: {
                properties: {
                    _metadata: metadataSchema,
                    data: type ? { $ref: getSchemaPath(type) } : {},
                },
            },
        }),
    );
}