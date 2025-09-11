import initDB from "../db.js";
import asyncHandler from "express-async-handler"
import ApiError from "./apiError.js";

// Core logic: updates DB
export const runExportJob = asyncHandler(async () => {
    
  const db = await initDB();

  if(!db) throw new ApiError('Database is not connected', 500)

  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const result = await db.run(
    `UPDATE documents
     SET status = 'not_exported'
     WHERE (status = 'moved' OR status = 'exported')
     AND exported_at IS NULL
     AND created_at <= ?`,
    [thirtyMinutesAgo]
  );

  if(!result){
    throw new ApiError("Job did not update any records",500)
  }

  console.log(`Job ran: ${result.changes} document(s) corrected `);
   return { corrected: result.changes, ids: [] };
    
});

// Express route handler (for Postman testing)
export const checkExportJob = asyncHandler(async (req, res, next) => {
    const result = await runExportJob();
    res.json({
      message: "Job executed successfully",
      corrected: result.changes,
    });

});
