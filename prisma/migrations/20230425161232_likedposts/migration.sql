-- CreateTable
CREATE TABLE "LikedPosts" (
    "likeId" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LikedPosts_pkey" PRIMARY KEY ("likeId")
);
