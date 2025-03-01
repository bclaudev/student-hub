import bcrypt from 'bcrypt';

const newPassword = 'admin'; // Change this to your new password
const hashedPassword = await bcrypt.hash(newPassword, 10);

console.log("New Hashed Password:", hashedPassword);

// $2b$10$qIQCSCGJG3lbahGNXy9ZCu9EDmX5TYXTndYAXIDLu8ofB/ffhP23K