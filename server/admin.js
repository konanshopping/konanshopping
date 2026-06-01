const bcrypt = require("bcryptjs");

async function createAdmin() {

  const password = "konan123";

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Mot de passe crypté :", hashedPassword);
}

createAdmin();