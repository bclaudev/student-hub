export const registerUser = async ({ body, set }) => {
  console.log("📌 Received request on /register:", body);

  const { firstName, lastName, email, password, confirmPassword, dateOfBirth } = body;

  // ✅ Validate Input
  if (!firstName || !lastName || !email || !password || !confirmPassword || !dateOfBirth) {
    set.status = 400;
    console.log("❌ Missing required fields");
    return { message: "All fields are required." };
  }

  if (password !== confirmPassword) {
    set.status = 400;
    console.log("❌ Passwords do not match");
    return { message: "Passwords do not match." };
  }

  console.log("🔍 Checking if user exists...");
  
  try {
    console.log("⏳ Connecting to the database...");
    
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).execute();
    
    console.log("✅ Database query completed!");

    if (existingUser.length > 0) {
      set.status = 409;
      console.log("❌ Email already registered");
      return { message: "Email already registered" };
    }

    console.log("🔑 Registering new user...");
    
    const newUser = await db.insert(usersTable).values({
      firstName,
      lastName,
      email,
      password, // 🔹 NOTE: This should be **hashed** before storing
      dateOfBirth,
    }).returning();

    console.log("✅ User registered:", newUser);
    set.status = 201;
    return { message: "User registered successfully!", user: newUser };

  } catch (error) {
    console.error("❌ Database query failed:", error);
    set.status = 500;
    return { message: "Database error" };
  }
};
