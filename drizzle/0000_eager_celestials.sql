-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(20) NOT NULL,
	"quantity" integer DEFAULT 0,
	"price" real NOT NULL,
	"sku" integer,
	"userId" integer NOT NULL,
	"createdAt" date,
	CONSTRAINT "products_sku_key" UNIQUE("sku")
);

*/