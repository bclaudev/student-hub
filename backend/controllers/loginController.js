import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { usersTable } from '../schema/users.js';
import { eq } from 'drizzle-orm';

export const login = async (c) => {
  try {
    console.log("Incoming request to /login");

    const { email, password } = await c.req.json();

    //Find user by email
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      console.log("Invalid email or password.");
      return c.json({ message: "Invalid email or password." }, 401);
    }

    //Compare password
    if (password !== user.password) {
      console.log("Password incorrect.");
      return c.json({ message: "Invalid email or password." }, 401);
    }

    //Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    //Set the token as a cookie
    c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Secure=false; SameSite=Strict`);

    console.log("Login successful!");
    return c.json({
      message: "Login successful!",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ message: "An error occurred. Please try again later." }, 500);
  }
};
