import { Router } from "express";
import { UserRepository } from "../repositories/userRepository";
import { JwtService } from "../services/jwtService";
import { JwtRepository } from "../repositories/jwtRepository";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";

class AuthRoutes {
	private router: Router;
	private authController: AuthController;

	constructor() {
		const userRepository = new UserRepository();
		const jwtRepository = new JwtRepository();
		const jwtService = new JwtService(jwtRepository);
		const authService = new AuthService(userRepository, jwtService);

		this.authController = new AuthController(authService);

		this.router = Router();

		this.routes();
	}

	private routes() {
		this.router.post(
			"/login",
			this.authController.login.bind(this.authController),
		);

		this.router.post(
			"/refreshToken",
			this.authController.refreshToken.bind(this.authController),
		);
	}

	public getRoutes() {
		return this.router;
	}
}

export const authRoutes = new AuthRoutes();
