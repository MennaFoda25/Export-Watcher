import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import initDB from '../db.js'
import {createToken} from '../utils/createToken.js'

export const registerUser = asyncHandler(async(req,res,next)=>{
    const db = await initDB()
    const {username, password} = req.body
    const hashedPassword = await bcrypt.hash(password,10)

    await db.run("INSERT INTO users (username,password) VALUES (?,?)", [
        username, hashedPassword
    ])

    res.status(201).json({message: "User registered"})
})

export const loginUser = asyncHandler(async (req, res) => {
  const db = await initDB();
  const { username, password } = req.body;

  const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      username: user.username,
      token: createToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});


export const getAllUsers = (asyncHandler (async(req,res,next)=>{
   const db = await initDB();
const users =   await db.all('SELECT * FROM users')

res.status(200).json({users})
}))