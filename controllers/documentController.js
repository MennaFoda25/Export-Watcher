import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import initDB from "../db.js";

let DB;
initDB().then((db)=> (DB =db))

// @desc    Seed 10 documents
// @route   POST /api/documents/seed
export const seedDocuments = asyncHandler(async(req,res,next)=>{
    if(!DB) return next(new ApiError("Database is not intialized", 500))

        for(let i = 0 ; i<10;i++){
            const type = i % 2 === 0 ? "invoice": "receipt"
            const status = "new"
            const createdAt = new Date(Date.now()- i * 60 * 60 *1000).toISOString()

            await DB.run(
                  "INSERT INTO documents (type, status, created_at) VALUES (?, ?, ?)",
      [type, status, createdAt]
            )
        }
        res.status(201).json({message: "10 test documents seeded"})
})

// @desc    Get all documents
// @route   GET /api/documents
export const getDocuments = asyncHandler(async(req,res,rext)=>{
    const rows =await DB.all("SELECT * FROM documents")
    res.json({documents:rows})
})


// @desc    Mark document exported
// @route   POST /api/documents/:id/mark-exported
export const markExported = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const doc = await DB.get("SELECT * FROM documents WHERE id=?",[id])

    if(!doc) return next(new(ApiError("Document not found", 404)))

      if(doc.status === "exported" && doc.exported_at){
        return res.json({message: "Already exported", document:doc})
      }  

      const now = new Date().toISOString()
      await DB.run(
           "UPDATE documents SET status = ?, exported_at = ? WHERE id = ?",
    ["exported", now, id]
      )

      const updated = await DB.get("SELECT * FROM documents WHERE id = ?", [id]);
  res.json({ message: "Document marked as exported", document: updated });
})