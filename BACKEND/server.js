import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import cron from "node-cron";

const app = express();
app.use(cors());
app.use(express.json());


// REGISTER
app.post("/register", async (req, res) => {
    const { fullName, email, password, role, country } = req.body;

    if (!fullName || !email || !password || !role || !country) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // Vérification si l'email existe déjà
    const existing = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existing) {
        return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await db.run(
            `INSERT INTO users (fullName, email, password, role, country) VALUES (?, ?, ?, ?, ?)`,
            [fullName, email, hashedPassword, role, country]
        );

        res.status(201).json({
            message: "User created",
            role: role,
            fullName: fullName,
            id: result.lastID
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



// LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et password requis" });
    }

    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
    id: user.id,
    fullName: user.fullName,
    role: user.role
});
});

//supprimer un projet finis tous ses taches 
export async function checkAndDeleteProject(projectId) {
  // Récupérer tous les besoins du projet
  const needs = await db.all(
    `SELECT * FROM project_needs WHERE project_id = ?`,
   [projectId]
  );

  if (needs.length === 0) {
    console.log("Ce projet n'a pas de besoins ou n'existe pas.");
    return;
  }

  // Vérifier si tous les besoins sont satisfaits
  const allFulfilled = needs.every(
    (need) => need.quantity_fulfilled >= need.quantity_needed
  );

  if (allFulfilled) {

    // Supprimer tous les besoin 
   
await db.run(`DELETE FROM project_needs WHERE project_id = ?`, [projectId]);
 // Supprimer le projet
await db.run(`DELETE FROM projects WHERE id = ?`, [projectId]);

    console.log(`Projet ${projectId} supprimé car tous les besoins sont satisfaits`);
  } else {
    console.log(`Projet ${projectId} n'est pas encore terminé`);
  }
}



//display les projets non vérifiées 
// GET projects non vérifiés
app.get("/projects/unverified", async (req, res) => {
    try {
        const projects = await db.all(
            `SELECT * FROM projects WHERE verified = 0`
        );
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


// Route pour ajouter un projet
// POST /projects - Ajouter un projet avec ses besoins
app.post('/projects', async (req, res) => {
    try {
        const { title, description, field, location, owner_id, status, needs } = req.body;

        if (!title || !field || !owner_id || !status || !needs) {
            return res.status(400).json({ error: "Champs requis manquants" });
        }

        // Récupérer le rôle du propriétaire
        const owner = await db.get(`SELECT role FROM users WHERE id = ?`, [owner_id]);
        if (!owner) return res.status(400).json({ error: "Owner introuvable" });

        const verified = owner.role === "project_owner" ? 1 : 0;

        // Déterminer la priorité selon le domaine
        let priority;
        switch (field.toLowerCase()) {
            case "health": priority = 0; break;
            case "water": priority = 1; break;
            case "housing": priority = 2; break;
            case "education": priority = 3; break;
            default: priority = 4;
        }

        // 1️⃣ Ajouter le projet dans la table projects
        const result = await db.run(
            `INSERT INTO projects (title, description, field, location, owner_id, status, priority, verified)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, field, location, owner_id, status, priority, verified]
        );

        const projectId = result.lastID;

        // 2️⃣ Ajouter les besoins dans la table project_needs
        const needsInsertPromises = needs.map(need => {
            return db.run(
                `INSERT INTO project_needs (project_id, type, name, quantity_needed)
                 VALUES (?, ?, ?, ?)`,
                [projectId, need.type, need.name, need.quantity]
            );
        });

        await Promise.all(needsInsertPromises);

        res.status(201).json({ message: "Projet et besoins ajoutés avec succès !" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// GET /projects?title=nom_du_projet
app.get("/projects", async (req, res) => {
    const title = req.query.title;
    if (!title) return res.status(400).json({ error: "Missing title" });

    const project = await db.all(`SELECT * FROM projects WHERE title = ?`, [title]);
    res.json(project); // renvoie un tableau (vide si non trouvé)
});


// Modifier un projet
app.put("/projects/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, field, location, status, needs } = req.body;

    try {
        // Vérifier que le projet existe
        const project = await db.get(`SELECT * FROM projects WHERE id = ?`, [id]);
        if (!project) return res.status(404).json({ error: "Projet inexistant" });

        // Mettre à jour la table projects
        await db.run(
            `UPDATE projects SET title = ?, description = ?, field = ?, location = ?, status = ? WHERE id = ?`,
            [title, description, field, location, status, id]
        );

        // Mettre à jour les besoins (project_needs)
        for (let need of needs) {
            const existingNeed = await db.get(
                `SELECT * FROM project_needs WHERE project_id = ? AND type = ?`,
                [id, need.type]
            );
            if (existingNeed) {
                // Si le besoin existe, on met à jour la quantité et le nom
                await db.run(
                    `UPDATE project_needs SET name = ?, quantity_needed = ? WHERE id = ?`,
                    [need.name, need.quantity, existingNeed.id]
                );
            } else {
                // Sinon, on l'insère
                await db.run(
                    `INSERT INTO project_needs (project_id, type, name, quantity_needed) VALUES (?, ?, ?, ?)`,
                    [id, need.type, need.name, need.quantity]
                );
            }
        }

        res.json({ message: "Projet mis à jour avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Route pour modifier un projet directement par son title
// Mettre à jour un projet par son titre
app.put("/projects/update-by-title", async (req, res) => {
    const { title, description, field, location, status, needs } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Le titre du projet est requis" });
    }

    try {
        // Chercher le projet par son titre (insensible à la casse)
        const project = await db.get(
            `SELECT * FROM projects WHERE title = ? COLLATE NOCASE`,
            [title]
        );

        if (!project) {
            return res.status(404).json({ error: "Projet non trouvé" });
        }

        // Mettre à jour les informations principales du projet
        await db.run(
            `UPDATE projects 
             SET description = ?, field = ?, location = ?, status = ? 
             WHERE id = ?`,
            [description, field, location, status, project.id]
        );

        // Supprimer tous les besoins existants du projet
        await db.run(
            `DELETE FROM project_needs WHERE project_id = ?`,
            [project.id]
        );

        // Réinsérer tous les besoins fournis par l'utilisateur
        for (let need of needs) {
            await db.run(
                `INSERT INTO project_needs (project_id, type, name, quantity_needed)
                 VALUES (?, ?, ?, ?)`,
                [project.id, need.type, need.name, need.quantity]
            );
        }

        res.json({ message: "Projet trouvé et mis à jour avec succès, tous les besoins ont été remplacés" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Vérifier un projet par son titre
app.put("/projects/verify-by-title", async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Le titre du projet est requis" });
    }

    try {
        // Chercher le projet par titre
        const project = await db.get(
            `SELECT * FROM projects WHERE title = ? COLLATE NOCASE`,
            [title]
        );

        if (!project) {
            return res.status(404).json({ error: "Projet non trouvé" });
        }

        // Mettre verified à true
        await db.run(
            `UPDATE projects SET verified = 1 WHERE id = ?`,
            [project.id]
        );

        res.json({ message: `Le projet "${title}" est maintenant vérifié` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});



// ------------------- ROUTES CONTRIBUTIONS -------------------

// Ajouter une contribution
app.post('/contributions', async (req, res) => {
  try {
    
    const { user_id, project_id, type, data } = req.body;

    const result = await db.run(
      `INSERT INTO contributions (user_id, project_id, type) VALUES (?, ?, ?)`,
      [user_id, project_id, type]
    );
    const contribution_id = result.lastID;

    switch(type) {
      case 'money':
        await db.run(
          `INSERT INTO contribution_money (contribution_id, amount, ccp, email, name)
           VALUES (?, ?, ?, ?, ?)`,
          [contribution_id, data.amount, data.ccp, data.email, data.name]
        );
        break;

      case 'material':
        await db.run(
          `INSERT INTO contribution_material (contribution_id, material_name, quantity, contact)
           VALUES (?, ?, ?, ?)`,
          [contribution_id, data.material_name, data.quantity, data.contact]
        );
        break;

      case 'human_help':
        await db.run(
          `INSERT INTO contribution_human (contribution_id, skill, contact, hours)
           VALUES (?, ?, ?, ?)`,
          [contribution_id, data.skill, data.contact, data.hours]
        );
        break;

      case 'full_investment':
        await db.run(
          `INSERT INTO contribution_full_investment (contribution_id, total_amount, materials, human_help)
           VALUES (?, ?, ?, ?)`,
          [
            contribution_id,
            data.total_amount,
            JSON.stringify(data.materials || []),
            JSON.stringify(data.human_help || [])
          ]
        );
        break;

      default:
        return res.status(400).json({ message: 'Type de contribution invalide' });
    }

    res.status(201).json({ message: 'Contribution ajoutée avec succès', contribution_id });
  } catch (error) {
    console.error("Erreur lors de l'ajout de contribution:", error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer toutes les contributions d’un projet avec détails
app.get('/projects/:id/contributions', async (req, res) => {
  try {
    
    const project_id = req.params.id;

    // Récupérer toutes les contributions principales
    const contributions = await db.all('SELECT * FROM contributions WHERE project_id = ?', [project_id]);

    const detailed = [];
    for (const c of contributions) {
      let details;
      switch(c.type) {
        case 'money':
          details = await db.get('SELECT * FROM contribution_money WHERE contribution_id = ?', [c.id]);
          break;
        case 'material':
          details = await db.get('SELECT * FROM contribution_material WHERE contribution_id = ?', [c.id]);
          break;
        case 'human_help':
          details = await db.get('SELECT * FROM contribution_human WHERE contribution_id = ?', [c.id]);
          break;
        case 'full_investment':
          details = await db.get('SELECT * FROM contribution_full_investment WHERE contribution_id = ?', [c.id]);
          if (details) {
            details.materials = JSON.parse(details.materials || '[]');
            details.human_help = JSON.parse(details.human_help || '[]');
          }
          break;
      }
      detailed.push({ ...c, details });
    }

    res.json(detailed);
  } catch (error) {
    console.error("Erreur lors de la récupération des contributions:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour stocker temporairement le domaine (optionnel)
let chosenCategory = null;

app.post('/set-category', (req, res) => {
  chosenCategory = req.body.category;
  res.json({ ok: true });
});

// Endpoint pour renvoyer les projets vérifiés du domaine choisi
app.get('/projects-verified', (req, res) => {
  const category = req.query.category;

  if (!category) {
    return res.json([]);
  }

  const sql = `
    SELECT *
    FROM projects
    WHERE field = ? AND verified = 1
  `;

  db.all(sql, [category], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});


// Cron mensuel
cron.schedule("0 0 1 * *", async () => {
  console.log("🕛 Vérification mensuelle des projets...");

  try {
    const projects = await db.all(`SELECT id FROM projects`);

    for (const project of projects) {
      await checkAndDeleteProject(project.id);
    }

    console.log("✅ Vérification terminée");
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
});