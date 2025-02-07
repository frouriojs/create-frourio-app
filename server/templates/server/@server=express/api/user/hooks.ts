import { expressjwt } from 'express-jwt';
import { API_JWT_SECRET } from 'service/envValues';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  auth: {
    id: string;
  };
};

export default defineHooks(() => ({
  onRequest: expressjwt({ secret: API_JWT_SECRET, algorithms: ['HS256'] }),
}));
