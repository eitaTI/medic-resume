-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clinicaId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "laudoPath" TEXT,
    "topicos" TEXT,
    "usarModeloPadrao" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Exame_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exame" ("clinicaId", "id", "laudoPath", "nome", "topicos") SELECT "clinicaId", "id", "laudoPath", "nome", "topicos" FROM "Exame";
DROP TABLE "Exame";
ALTER TABLE "new_Exame" RENAME TO "Exame";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
