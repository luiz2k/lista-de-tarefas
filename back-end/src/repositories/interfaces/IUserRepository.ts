import type { UserInput } from "../../types/user";

export type UserOutput = {
	id: string;
	email: string;
	password: string;
};

export interface IUserRepository {
	create(data: UserInput): Promise<UserOutput>;

	findByEmail(email: string): Promise<UserOutput | null>;

	findById(id: string): Promise<UserOutput | null>;

	update(id: string, user: Partial<UserInput>): Promise<void>;

	remove(id: string): Promise<void>;
}
