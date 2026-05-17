import prisma from "./lib/prisma";

async function testWithdraw() {
  const userId = 'test-freelancer-id';
  const amount = 10000;
  
  console.log("--- BEFORE WITHDRAWAL ---");
  const walletBefore = await prisma.wallet.findUnique({ where: { userId } });
  console.log(`Balance: ${walletBefore?.balance}`);
  
  // Simulate API call
  console.log(`\nWithdrawing ${amount}...`);
  await prisma.wallet.update({
    where: { userId },
    data: { balance: { decrement: amount } }
  });
  
  await prisma.transaction.create({
    data: {
      userId,
      amount: -amount,
      type: "WITHDRAWAL",
      description: "Test Withdrawal",
      status: "IN_PROGRESS",
      createdAt: new Date()
    }
  });

  console.log("\n--- AFTER WITHDRAWAL ---");
  const walletAfter = await prisma.wallet.findUnique({ where: { userId } });
  const txns = await prisma.transaction.findMany({ where: { userId } });
  
  console.log(`Balance: ${walletAfter?.balance}`);
  console.log(`Latest Transaction:`, txns[txns.length - 1]);
}

testWithdraw();
