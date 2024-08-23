import { UnauthorizedError } from "../helpers/errorHandler.js";
import { JwtRepository } from "../repositories/jwtRepository.js";
import { JwtService } from "../services/jwtService.js";

import type { NextFunction, Request, Response } from "express";
import type { IJwtService } from "../services/interfaces/IJwtService.js";

class AuthMiddleware {
	constructor(private readonly jwtService: IJwtService) {}

	public async handle(
		req: Request,
		_res: Response,
		next: NextFunction,
	): Promise<void> {
		const { authorization } = req.headers;

		if (!authorization) {
			throw new UnauthorizedError("Token inválido.");
		}

		const [bearer, token] = authorization.split(" ");

		if (bearer !== "Bearer" || !token) {
			throw new UnauthorizedError("Token inválido.");
		}

		const payload = await this.jwtService.verifyToken(token);

		if (!payload) {
			throw new UnauthorizedError("Token inválido.");
		}

		req.user = payload;

		next();
	}
}

const jwtRepository = new JwtRepository();
const jwtService = new JwtService(jwtRepository);
export const authMiddleware = new AuthMiddleware(jwtService);
