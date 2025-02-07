import { z } from 'zod';

const NEXT_PUBLIC_API_BASE_PATH = z.string().url().parse(process.env.NEXT_PUBLIC_API_BASE_PATH);

export { NEXT_PUBLIC_API_BASE_PATH };
