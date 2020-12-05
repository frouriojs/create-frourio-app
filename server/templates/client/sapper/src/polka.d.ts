import { RequestHandler } from 'express';

declare module "polka" {
  export interface Polka {
    /**
     * Parses the `req.url` property of the given request.
     */
    parse(req: Request): Url;

    /**
     * Attach middleware(s) and/or sub-application(s) to the server.
     * These will execute before your routes' handlers.
     */
    use(...handlers: RequestHandler[]): this;

    /**
     * Attach middleware(s) and/or sub-application(s) to the server.
     * These will execute before your routes' handlers.
     */
    use(pattern: string | RegExp, ...handlers: RequestHandler[] | Polka[]): this;

    /**
     * Boots (or creates) the underlying `http.Server` for the first time.
     */
    listen(port?: number, hostname?: string): this;

    /**
     * Boots (or creates) the underlying `http.Server` for the first time.
     * All arguments are passed to server.listen directly with no changes.
     */
    listen(...args: unknown[]): this;

    /**
     * The main Polka `IncomingMessage` handler.
     * It receives all requests and tries to match the incoming URL against known routes.
     */
    handler(req: Request, res: ServerResponse, parsed?: Url): void;
  }
}
