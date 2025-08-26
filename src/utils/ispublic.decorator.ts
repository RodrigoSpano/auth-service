import { SetMetadata } from '@nestjs/common';

// metadata to call for public paths
export const IS_PUBLIC_KEY = 'isPublic';
export const PublicEndpoint = () => SetMetadata(IS_PUBLIC_KEY, true);
