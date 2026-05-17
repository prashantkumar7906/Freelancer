import prisma from "./lib/prisma";

async function verify() {
  const users = [
    { email: 'test@pro.com', role: 'FREELANCER' },
    { email: 'buyer@pro.com', role: 'BUYER' }
  ];

  for (const u of users) {
    const user = await prisma.user.findUnique({ where: { email: u.email } });
    if (user) {
      const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
      console.log(`USER: ${u.email} | ROLE: ${user.role} | BALANCE: ${wallet?.balance}`);
    } else {
      console.log(`USER NOT FOUND: ${u.email}`);
    }
  }
}

verify();
