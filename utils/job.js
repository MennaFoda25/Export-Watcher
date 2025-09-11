import initDB from "../db.js";

// Core logic: updates DB
export const runExportJob = async () => {
    try{
  const db = await initDB();

  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const result = await db.run(
    `UPDATE documents
     SET status = 'not_exported'
     WHERE (status = 'moved' OR status = 'exported')
     AND exported_at IS NULL
     AND created_at <= ?`,
    [thirtyMinutesAgo]
  );

  console.log(`Job ran: ${result.changes} document(s) corrected `);
   return { corrected: result.changes, ids: [] };
    }catch(err){
          console.error("Job error:", err);
    }
};

// Express route handler (for Postman testing)
export const checkExportJob = async (req, res, next) => {
  try {
    const result = await runExportJob();
    res.json({
      message: "Job executed successfully",
      corrected: result.changes,
    });
  } catch (err) {
   console.error("Job error:", err);
    res.status(500).json({ error: err.message });
  }
};
