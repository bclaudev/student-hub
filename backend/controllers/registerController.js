import { db } from '../config/db.js';
import { usersTable} from '../schema/users.js';
import { eq } from 'drizzle-orm';

export const registerUser = async (c) => {
  try {

    console.log("🛠 Incoming request to /register");

    // ✅ Debug: Log Raw Body
    const rawBody = await c.req.text();
    console.log("Raw Request Body:", rawBody);

    if (!rawBody.trim()) {
      console.log("Request body is empty!");
      return c.json({ message: "Request body cannot be empty" }, 400);
    }

    const { email, password, firstName, lastName, dateOfBirth} = await c.req.json();

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
      console.log("Missing required fields");
      return c.json({ message: "All fields (email, password, firstName, lastName, dateOfBirth) are required" }, 400);
    }

    //Checking if the user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

      if (existingUser.length) {
        console.log("Email already in use: ", email)
        return c.json({message: "Email already in use"}, 400);
      }

      //Insert new user in the database
      const [newUser] = await db.insert(usersTable).values({
        email,
        password,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth)
      }).returning();
    
      console.log("User registered successfully!")

      return c.json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          dateOfBirth: newUser.dateOfBirth,
        },
      });
    } catch (error) {
        console.log("Error during registration: ", error);
        return c.json({ message: "Internal server error" }, 500);
    }
}