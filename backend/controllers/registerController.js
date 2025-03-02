import { db } from '../config/db.js';
import { usersTable } from '../schema/users.js';
import { eq } from 'drizzle-orm';

export const registerUser = async (c) => {
  try {
    const rawBody = await c.req.text();
    console.log("🔍 Raw Request Body:", rawBody);

    if (!rawBody.trim()) {
      console.log("❌ Request body is empty!");
      return c.json({ message: "Request body cannot be empty" }, 400);
    }

    const parsedBody = JSON.parse(rawBody); // ✅ Manually parse JSON
    console.log("🔍 Parsed Request Body:", parsedBody);

    const { email, password, firstName, lastName, dateOfBirth } = parsedBody;

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
      console.log("❌ Missing required fields");
      return c.json({ message: "All fields (email, password, firstName, lastName, dateOfBirth) are required" }, 400);
    }

    // ✅ Validate date format
    const parsedDate = new Date(dateOfBirth);
    if (isNaN(parsedDate.getTime())) {
      console.log("❌ Invalid date format:", dateOfBirth);
      return c.json({ message: "Please provide a valid date of birth in YYYY-MM-DD format." }, 400);
    }

    console.log("✅ Valid Date Format:", parsedDate.toISOString());

    // ✅ Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length) {
      console.log("❌ Email already in use: ", email);
      return c.json({ message: "Email already in use" }, 400);
    }

    // ✅ Insert new user into the database
    const [newUser] = await db.insert(usersTable).values({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth: parsedDate, // ✅ Save properly formatted date
    }).returning();

    console.log("✅ User registered successfully!");

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
    console.error("❌ Error during registration:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
