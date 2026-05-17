const bcrypt = require("bcrypt");

const hash = "$2b$10$XJqKGIFH.jxPtXbr3Uh0TOI89EYL6Z6z7ikWPobaLRdXL3LOpLzzG";
const password = "password123";

async function test() {
    const match = await bcrypt.compare(password, hash);
    console.log("Password match:", match);

    // Try with another hash just in case
    const newHash = await bcrypt.hash(password, 10);
    const matchNew = await bcrypt.compare(password, newHash);
    console.log("New hash match:", matchNew);
    console.log("New hash:", newHash);
}

test();
