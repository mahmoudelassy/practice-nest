-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artists" TEXT[],
    "releasedDate" DATE NOT NULL,
    "duration" TIME NOT NULL,
    "lyrics" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);
