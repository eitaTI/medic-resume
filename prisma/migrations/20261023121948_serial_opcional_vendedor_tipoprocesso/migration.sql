-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dispositivo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clinicaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT,
    CONSTRAINT "Dispositivo_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Dispositivo" ("clinicaId", "id", "marca", "modelo", "numeroSerie", "tipo") SELECT "clinicaId", "id", "marca", "modelo", "numeroSerie", "tipo" FROM "Dispositivo";
DROP TABLE "Dispositivo";
ALTER TABLE "new_Dispositivo" RENAME TO "Dispositivo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
