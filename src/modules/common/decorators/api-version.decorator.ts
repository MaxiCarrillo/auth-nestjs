import { applyDecorators } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { ACCEPT_VERSION_HEADER } from "../constants";

export function ApiVersionHeader() {
    return applyDecorators(
        ApiHeader({
            name: ACCEPT_VERSION_HEADER,
            description: 'API version',
            required: true,
            schema: { type: 'string', default: '1' },
        }),
    );
}