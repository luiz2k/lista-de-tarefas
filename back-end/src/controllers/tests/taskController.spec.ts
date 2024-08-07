import { vi } from "vitest";
import { TaskRepository } from "../../tests/__mocks__/taskRepository";
import { TaskService } from "../../tests/__mocks__/taskService";
import { TaskController } from "../taskController";

import type { Request, Response } from "express";
import { Types } from "mongoose";
import type { ITaskRepository } from "../../repositories/interfaces/ITaskRepository";
import type { ITaskService } from "../../services/interfaces/ITaskService";

describe("taskController", () => {
	let taskRepository: ITaskRepository;
	let taskService: ITaskService;
	let taskController: TaskController;

	beforeEach(() => {
		taskRepository = new TaskRepository();
		taskService = new TaskService(taskRepository);
		taskController = new TaskController(taskService);
	});

	describe("create", () => {
		it("Deve criar uma tarefa", async () => {
			const userId = new Types.ObjectId().toString();

			const req: Partial<Request> = {
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
				body: {
					task: "Nova task",
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await taskController.create(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({
					message: "Tarefa criada com sucesso.",
					data: expect.objectContaining({
						_id: expect.any(Types.ObjectId),
						completed: false,
						createdAt: expect.any(Date),
						task: req.body.task,
						userId: expect.any(Types.ObjectId),
					}),
				}),
			);
		});

		it("Deve ocorrer um erro na válidação dos dados", async () => {
			const userId = new Types.ObjectId().toString();

			const req: Partial<Request> = {
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
				body: {
					task: "A",
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await expect(
				taskController.create(req as Request, res as Response),
			).rejects.toThrow("Erro na validação dos dados.");
		});
	});

	describe("findOne", () => {
		it("Deve encontrar uma tarefa", async () => {
			const userId = new Types.ObjectId().toString();
			const taskId = new Types.ObjectId();

			vi.spyOn(taskService, "findOne").mockReturnValueOnce(
				Promise.resolve({
					_id: taskId,
					userId: new Types.ObjectId(userId),
					task: "Tarefa 1",
					completed: false,
					createdAt: new Date(),
				}),
			);

			const req: Partial<Request> = {
				params: {
					id: taskId.toString(),
				},
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await taskController.findOne(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				message: "Tarefa encontrada.",
				data: {
					_id: taskId,
					completed: false,
					createdAt: expect.any(Date),
					task: "Tarefa 1",
					userId: new Types.ObjectId(userId),
				},
			});
		});

		it("Deve ocorrer um erro na válidação do ID do parametro", async () => {
			const userId = new Types.ObjectId().toString();

			const req: Partial<Request> = {
				params: {
					id: "id inválido",
				},
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await expect(
				taskController.findOne(req as Request, res as Response),
			).rejects.toThrow("Erro na validação dos dados.");
		});
	});

	describe("findAll", () => {
		it("Deve encontrar todas as tarefas", async () => {
			const userId = new Types.ObjectId().toString();

			const req: Partial<Request> = {
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
				body: {
					task: "Nova task",
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await taskController.findAll(req as Request, res as Response);

			expect(res.json).toHaveBeenCalledWith({
				message: "Tarefas encontradas.",
				data: expect.arrayContaining([]),
			});

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledTimes(1);

			await taskController.create(req as Request, res as Response);
			await taskController.findAll(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledTimes(3);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledTimes(3);

			expect(res.json).toHaveBeenCalledWith({
				message: "Tarefas encontradas.",
				data: expect.arrayContaining([
					{
						_id: expect.any(Types.ObjectId),
						completed: expect.any(Boolean),
						createdAt: expect.any(Date),
						task: req.body.task,
						userId: new Types.ObjectId(userId),
					},
				]),
			});
		});
	});

	describe("update", () => {
		it("Deve atualizar uma tarefa", async () => {
			const userId = new Types.ObjectId().toString();
			const taskId = new Types.ObjectId();

			vi.spyOn(taskService, "update").mockReturnValueOnce(Promise.resolve());

			const req: Partial<Request> = {
				params: {
					id: taskId.toString(),
				},
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
				body: {
					task: "Tarefa atualizada",
					completed: true,
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await taskController.update(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				message: "Tarefa atualizada.",
				data: req.body,
			});
		});

		it("Deve ocorrer um erro na validação dos dados do body", async () => {
			const userId = new Types.ObjectId().toString();

			vi.spyOn(taskService, "update").mockReturnValueOnce(Promise.resolve());

			const req: Partial<Request> = {
				params: {
					id: "id inválido",
				},
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
				body: {
					task: "Tarefa atualizada",
					completed: true,
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await expect(
				taskController.update(req as Request, res as Response),
			).rejects.toThrow("Erro na validação dos dados.");
		});

		it("Deve ocorrer um erro na validação dos dados do parametro id", async () => {
			const userId = new Types.ObjectId().toString();
			const taskId = new Types.ObjectId();

			vi.spyOn(taskService, "update").mockReturnValueOnce(Promise.resolve());

			const req: Partial<Request> = {
				params: {
					id: taskId.toString(),
				},
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
				body: "body inválido",
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await expect(
				taskController.update(req as Request, res as Response),
			).rejects.toThrow("Erro na validação dos dados.");
		});
	});

	describe("remove", () => {
		it("Deve remover uma tarefa", async () => {
			const userId = new Types.ObjectId().toString();
			const taskId = new Types.ObjectId();

			vi.spyOn(taskService, "remove").mockReturnValueOnce(Promise.resolve());

			const req: Partial<Request> = {
				params: {
					id: taskId.toString(),
				},
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await taskController.remove(req as Request, res as Response);

			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				message: "Tarefa removida.",
			});
		});

		it("Deve ocorrer um erro na validação dos dados do parametro id", async () => {
			const userId = new Types.ObjectId().toString();

			vi.spyOn(taskService, "remove").mockReturnValueOnce(Promise.resolve());

			const req: Partial<Request> = {
				params: {
					id: "id inválido",
				},
				user: {
					id: userId,
					iat: Date.now() / 1000,
					exp: Date.now() / 1000,
				},
			};

			const res: Partial<Response> = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			};

			await expect(
				taskController.remove(req as Request, res as Response),
			).rejects.toThrow("Erro na validação dos dados.");
		});
	});
});
