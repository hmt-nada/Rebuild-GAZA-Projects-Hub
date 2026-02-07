// db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
  filename: "./rebuild.db",
  driver: sqlite3.Database
});

await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  country TEXT
);


CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        field TEXT,
        location TEXT,
        owner_id INTEGER,
        status TEXT,
        priority TEXT,
        verified BOOLEAN DEFAULT 0
);


CREATE TABLE project_needs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,         -- Identifiant unique du besoin
    project_id INTEGER NOT NULL,                  -- Référence au projet
    type TEXT NOT NULL,                           -- Type du besoin (ex: matériel, humain, financier)
    name TEXT NOT NULL,                           -- Nom du besoin
    quantity_needed INTEGER NOT NULL,             -- Quantité nécessaire
    quantity_fulfilled INTEGER DEFAULT 0,         -- Quantité déjà fournie
    FOREIGN KEY (project_id) REFERENCES projects(id) -- Lien avec la table des projets
);

CREATE TABLE IF NOT EXISTS contributions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        type TEXT CHECK(type IN ('money','material','human_help','full_investment')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contribution_money (
        contribution_id INTEGER PRIMARY KEY,
        amount REAL NOT NULL,
        ccp TEXT,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY(contribution_id) REFERENCES contributions(id)
      );

      CREATE TABLE IF NOT EXISTS contribution_material (
        contribution_id INTEGER PRIMARY KEY,
        material_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        contact TEXT,
        FOREIGN KEY(contribution_id) REFERENCES contributions(id)
      );

      CREATE TABLE IF NOT EXISTS contribution_human (
        contribution_id INTEGER PRIMARY KEY,
        skill TEXT NOT NULL,
        contact TEXT,
        hours INTEGER,
        FOREIGN KEY(contribution_id) REFERENCES contributions(id)
      );

      CREATE TABLE IF NOT EXISTS contribution_full_investment (
        contribution_id INTEGER PRIMARY KEY,
        total_amount REAL NOT NULL,
        materials TEXT,
        human_help TEXT,
        FOREIGN KEY(contribution_id) REFERENCES contributions(id)
      );
`);     
   
console.log("✅ Database initialized");
