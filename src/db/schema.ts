import {
	integer,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	username: varchar({ length: 255 }),
	title: varchar({ length: 255 }).notNull(),
	content: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersTable = pgTable("users", {
	id: uuid().primaryKey().defaultRandom().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authTable = pgTable("auth", {
	id: uuid().primaryKey().defaultRandom().notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
