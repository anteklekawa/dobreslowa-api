-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "posts" TEXT[],
    "accessToken" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Posts" (
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imgUrl" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" TEXT[],
    "datetime" TIMESTAMP(3) NOT NULL,
    "author" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "verifyStatus" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "Comments" (
    "commentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "Events" (
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "imgUrls" TEXT[],

    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
