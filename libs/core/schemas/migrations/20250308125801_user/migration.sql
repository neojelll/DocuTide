-- CreateTable
CREATE TABLE "users" (
    "user_id" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "username" VARCHAR(15) NOT NULL,
    "hash_password" VARCHAR(60) NOT NULL,
    "biography" TEXT,
    "role" VARCHAR(15) NOT NULL DEFAULT 'user',
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
