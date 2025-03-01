import { db } from '../config/db.js';
import { usersTable} from '../schema/users.js';
import { eq } from 'drizzle-orm';

export const registerUser = async ({ body, set }) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth} = await c.req.json();

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