-- CreateTable
CREATE TABLE "User"
(
    "id"          TEXT    NOT NULL,
    "name"        TEXT    NOT NULL,
    "email"       TEXT    NOT NULL,
    "username"    TEXT    NOT NULL,
    "verified"    BOOLEAN NOT NULL DEFAULT false,
    "roles"       TEXT[],
    "permissions" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken"
(
    "id"        TEXT         NOT NULL,
    "token"     TEXT         NOT NULL,
    "userId"    TEXT         NOT NULL,
    "expiry"    TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");
