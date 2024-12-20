"use server";

import { API } from "@/modules/shared/utils/apiConnection";
import { cookies } from "next/headers";

import type { ErrorException } from "@/modules/shared/types/errorException";
import type { z } from "zod";
import type { loginSchema } from "../../../shared/validations/authValidation";
import type { Tokens } from "./types";

export const login = async (
	data: z.infer<typeof loginSchema>,
): Promise<undefined | ErrorException> => {
	const response = await API.request<Tokens>({
		method: "POST",
		path: "/auth/login",
		body: JSON.stringify(data),
		cache: "no-store",
	});

	if (response.error) {
		return {
			error: response.error,
			message: response.message,
			statusCode: response.statusCode,
		};
	}

	// Define a sessão do usuário no cookie
	cookies().set("session", JSON.stringify(response.data), {
		httpOnly: true,
	});
};
