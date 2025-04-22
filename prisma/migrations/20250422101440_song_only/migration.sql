/*
  Warnings:

  - You are about to drop the `Artist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `songs_artists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artist" DROP CONSTRAINT "Artist_userId_fkey";

-- DropForeignKey
ALTER TABLE "songs_artists" DROP CONSTRAINT "songs_artists_artistId_fkey";

-- DropForeignKey
ALTER TABLE "songs_artists" DROP CONSTRAINT "songs_artists_songId_fkey";

-- DropTable
DROP TABLE "Artist";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "songs_artists";
