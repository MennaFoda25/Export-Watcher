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
    const {
         from,
    to,
    status,
    page = 1,
    pageSize = 10,
    sort = "created_at:desc",
  } = req.query;

  const offset = (page -1) * pageSize

  let whereClauses = []
  let params =[]

   if (from) {
    whereClauses.push("created_at >= ?");
    params.push(from);
  }

  if (to) {
    whereClauses.push("created_at <= ?");
    params.push(to);
  }

  if (status) {
    whereClauses.push("status = ?");
    params.push(status);
  }


  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Sorting
  const [sortField, sortOrder] = sort.split(":");
  const orderSQL = `ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;

  // Pagination
  const limitSQL = `LIMIT ? OFFSET ?`;
  params.push(Number(pageSize), offset);


    const rows = await DB.all(
    `SELECT * FROM documents ${whereSQL} ${orderSQL} ${limitSQL}`,
    params
  );
     // Count total
  const countRow = await DB.get(
    `SELECT COUNT(*) as total FROM documents ${whereSQL}`,
    params.slice(0, -2) // exclude limit+offset
  );

  res.json({
    status: "success",
    page: Number(page),
    pageSize: Number(pageSize),
    total: countRow.total,
    data: rows,
  });
});

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


// Add a new document
export const addDocument = async (req, res) => {
  const db = await initDB();
  const { type, status } = req.body;

  if (!type || !status) {
    return res.status(400).json({ message: 'type and status are required' });
  }

  const createdAt = new Date().toISOString();

  await db.run(
    'INSERT INTO documents (type, created_at, status) VALUES (?, ?, ?)',
    [type, createdAt, status]
  );

  res.status(201).json({ message: 'Document added successfully!' });
};

