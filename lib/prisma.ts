// Bypassing all binary dependencies like bcrypt for 100% reliability.
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "prisma", "mock-db.json");

const loadDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("[MOCK DB] Error loading database:", error);
  }
  return null;
};

const saveDb = () => {
  try {
    const data = {
      mockUsers: db.mockUsers,
      mockProjects: db.mockProjects,
      mockWallets: db.mockWallets,
      mockTransactions: db.mockTransactions,
      mockMessages: db.mockMessages || [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("[MOCK DB] Error saving database:", error);
  }
};

// Simple in-memory store
const db: {
  mockUsers: any[];
  mockProjects: any[];
  mockWallets: any[];
  mockTransactions: any[];
  mockMessages: any[];
} = (globalThis as any).__mockDb || {
  mockUsers: [],
  mockProjects: [],
  mockWallets: [],
  mockTransactions: [],
  mockMessages: [],
};

// Attach to globalThis so HMR re-evaluations reuse the same in-memory store
(globalThis as any).__mockDb = db;

const syncDb = () => {
  const data = loadDb();
  if (data) {
    if (data.mockUsers) { db.mockUsers.length = 0; db.mockUsers.push(...data.mockUsers); }
    if (data.mockProjects) { db.mockProjects.length = 0; db.mockProjects.push(...data.mockProjects); }
    if (data.mockWallets) { db.mockWallets.length = 0; db.mockWallets.push(...data.mockWallets); }
    if (data.mockTransactions) { db.mockTransactions.length = 0; db.mockTransactions.push(...data.mockTransactions); }
    if (data.mockMessages) { db.mockMessages.length = 0; db.mockMessages.push(...data.mockMessages); }
  }
};
// Initial sync
syncDb();

// Shorthand aliases used throughout the rest of this file
const mockUsers = db.mockUsers;
const mockProjects = db.mockProjects;
const mockWallets = db.mockWallets;
const mockTransactions = db.mockTransactions;

// Add a hook to syncDb before queries.
const syncBeforeQuery = () => syncDb();


// FORCE RESET / SEED the test accounts to be absolutely sure of its state
const seedDefaultData = () => {
  const usersToSeed = [
    {
      id: "test-freelancer-id",
      email: "test@pro.com",
      passwordHash: "password123",
      phoneNumber: "0000000000",
      role: "FREELANCER",
      status: "APPROVED",
      emailVerified: true,
      phoneVerified: true,
    },
    {
      id: "test-admin-id",
      email: "admin@pro.com",
      passwordHash: "password123",
      phoneNumber: "1111111111",
      role: "ADMIN",
      status: "APPROVED",
      emailVerified: true,
      phoneVerified: true,
    },
    {
      id: "test-buyer-id",
      email: "buyer@pro.com",
      passwordHash: "password123",
      phoneNumber: "2222222222",
      role: "BUYER",
      status: "APPROVED",
      emailVerified: true,
      phoneVerified: true,
    },
    {
      id: "pending-user-id",
      email: "pending@pro.com",
      passwordHash: "password123",
      phoneNumber: "3333333333",
      role: "FREELANCER",
      status: "PENDING",
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
    }
  ];

  usersToSeed.forEach(user => {
    const index = mockUsers.findIndex((u: any) => u.email === user.email);
    if (index === -1) {
      console.log(`[MOCK DB] Seeding default test user: ${user.email}`);
      mockUsers.push(user);
    } else {
      mockUsers[index] = { ...mockUsers[index], ...user };
    }

    // Seed a wallet for each user if it doesn't exist
    const walletIndex = mockWallets.findIndex((w: any) => w.userId === user.id);
    if (walletIndex === -1) {
      let initialBalance = 50000;
      if (user.role === "FREELANCER") initialBalance = 75000;
      if (user.role === "BUYER") initialBalance = 200000;
      
      mockWallets.push({ id: `w-${user.id}`, userId: user.id, balance: initialBalance }); 
    }
  });

  // Ensure mock projects have Title Case categories
  if (mockProjects.length === 3) {
      mockProjects[0].category = "Design";
      mockProjects[1].category = "Development";
      mockProjects[2].category = "Engineering";
  }
};
if (!db.mockUsers || db.mockUsers.length === 0) {
  seedDefaultData();
}

const prismaMock = {
  user: {
    findUnique: async ({ where }: any) => {
      syncBeforeQuery();
      console.log(`[MOCK DB] findUnique: ${where.email || where.id}`);
      if (where.id) return mockUsers.find((u: any) => u.id === where.id) || null;
      return mockUsers.find((u: any) => u.email === where.email) || null;
    },
    findFirst: async ({ where }: any) => {
      const or = where.OR || [];
      return mockUsers.find((u: any) =>
        or.some((cond: any) => u.email === cond.email || u.phoneNumber === cond.phoneNumber)
      ) || null;
    },
    findMany: async ({ where, orderBy }: any = {}) => {
      syncBeforeQuery();
      console.log(`[MOCK DB] user.findMany: ${JSON.stringify(where)}`);
      let filtered = [...mockUsers];
      if (where?.status) filtered = filtered.filter((u: any) => u.status === where.status);
      if (where?.emailVerified !== undefined) filtered = filtered.filter((u: any) => u.emailVerified === where.emailVerified);
      if (where?.phoneVerified !== undefined) filtered = filtered.filter((u: any) => u.phoneVerified === where.phoneVerified);

      if (orderBy?.createdAt === "desc") {
        filtered.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
      return filtered;
    },
    update: async ({ where, data }: any) => {
      console.log(`[MOCK DB] user.update: ${where.id}`);
      const index = mockUsers.findIndex((u: any) => u.id === where.id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data };
        saveDb();
        return mockUsers[index];
      }
      return null;
    },
    create: async ({ data }: any) => {
      const userId = data.id || Math.random().toString(36).substring(7);
      const newUser = {
        id: userId,
        ...data,
        status: data.status || "APPROVED",
        emailVerified: data.emailVerified ?? true,
        phoneVerified: data.phoneVerified ?? true,
      };
      mockUsers.push(newUser);
      saveDb();
      return newUser;
    },
    count: async ({ where }: any = {}) => {
      let filtered = [...mockUsers];
      if (where?.status) filtered = filtered.filter((u: any) => u.status === where.status);
      return filtered.length;
    },
  },
  notification: {
    findMany: async ({ where }: any) => {
      console.log(`[MOCK DB] notification.findMany: ${JSON.stringify(where)}`);
      return mockUsers.find((u: any) => u.id === where.userId)?.notifications || [];
    },
    create: async ({ data }: any) => {
      const user = mockUsers.find((u: any) => u.id === data.userId);
      const newNotif = { id: Math.random().toString(), createdAt: new Date(), ...data };
      if (user) {
        if (!user.notifications) user.notifications = [];
        user.notifications.push(newNotif);
        saveDb();
      }
      return newNotif;
    },
  },
  emailVerification: { create: async () => ({}) },
  phoneVerification: { create: async () => ({}) },
  project: {
    findMany: async ({ where, orderBy, include }: any = {}) => {
      syncBeforeQuery();
      console.log(`[MOCK DB] project.findMany: ${JSON.stringify(where)}`);
      let filtered = [...mockProjects];
      if (where?.buyerId) filtered = filtered.filter((p: any) => p.buyerId === where.buyerId);
      if (where?.status) filtered = filtered.filter((p: any) => p.status === where.status);
      if (where?.category) {
          filtered = filtered.filter((p: any) => p.category.toLowerCase() === where.category.toLowerCase());
      }
      if (where?.id) filtered = filtered.filter((p: any) => p.id === where.id);

      if (orderBy?.createdAt === "desc") {
        filtered.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      } else if (orderBy?.budget === "desc") {
        filtered.sort((a: any, b: any) => (b.budget || 0) - (a.budget || 0));
      }

      return filtered.map((p: any) => {
          let proj = { ...p, _count: { bids: p.bids?.length || 0 } };
          if (include?.bids) {
              proj.bids = p.bids || [];
              if (include.bids.include?.freelancer) {
                  proj.bids = proj.bids.map((b: any) => ({
                      ...b,
                      freelancer: mockUsers.find((u: any) => u.id === b.freelancerId)
                  }));
              }
          }
          return proj;
      });
    },
    create: async ({ data }: any) => {
      const newProj = {
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString(),
        status: "PENDING",
        bids: [],
        ...data
      };
      mockProjects.push(newProj);
      saveDb();
      return newProj;
    },
    findUnique: async ({ where, include }: any = {}) => {
      syncBeforeQuery();
      const p = mockProjects.find((p: any) => p.id === where.id);
      if (!p) return null;
      let proj = { ...p, _count: { bids: p.bids?.length || 0 } };
      if (include?.bids) {
          let matchingBids = [...(p.bids || [])];
          if (include.bids.where?.status) {
              matchingBids = matchingBids.filter(b => b.status === include.bids.where.status);
          }
          if (include.bids.include?.freelancer) {
              matchingBids = matchingBids.map(b => ({
                  ...b,
                  freelancer: mockUsers.find((u: any) => u.id === b.freelancerId)
              }));
          }
          proj.bids = matchingBids;
      }
      return proj;
    },
    update: async ({ where, data }: any) => {
      console.log(`[MOCK DB] project.update: ${where.id} with`, JSON.stringify(data));
      const index = mockProjects.findIndex((p: any) => p.id === where.id);
      if (index !== -1) {
        // Strip undefined values so they don't overwrite existing fields
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([, v]) => v !== undefined)
        );
        mockProjects[index] = { ...mockProjects[index], ...cleanData };
        saveDb();
        return mockProjects[index];
      }
      return null;
    },
    count: async ({ where }: any = {}) => {
      let filtered = [...mockProjects];
      if (where?.status) filtered = filtered.filter((p: any) => p.status === where.status);
      return filtered.length;
    },
  },
  wallet: {
    findUnique: async ({ where }: any) => {
      syncBeforeQuery();
      console.log(`[MOCK DB] wallet.findUnique: ${where.userId}`);
      return mockWallets.find((w: any) => w.userId === where.userId) || null;
    },
    update: async ({ where, data }: any) => {
      console.log(`[MOCK DB] wallet.update for user: ${where.userId || where.id}`);
      const index = mockWallets.findIndex((w: any) => w.userId === where.userId || w.id === where.id);
      if (index !== -1) {
        if (data.balance && typeof data.balance === 'object') {
          if (data.balance.decrement) mockWallets[index].balance -= data.balance.decrement;
          if (data.balance.increment) mockWallets[index].balance += data.balance.increment;
        } else if (typeof data.balance === 'number') {
          mockWallets[index].balance = data.balance;
        }
        saveDb();
        return mockWallets[index];
      } else if (where.userId) {
        // UPSERT LOGIC: Create wallet if it doesn't exist
        const newBalance = (data.balance && typeof data.balance === 'object') 
          ? (data.balance.increment || 0) - (data.balance.decrement || 0)
          : (typeof data.balance === 'number' ? data.balance : 0);
        
        const newWallet = { 
          id: `w-${where.userId}`, 
          userId: where.userId, 
          balance: newBalance 
        };
        mockWallets.push(newWallet);
        saveDb();
        return newWallet;
      }
      return null;
    }
  },
  transaction: {
    findMany: async ({ where, orderBy }: any = {}) => {
      syncBeforeQuery();
      console.log(`[MOCK DB] transaction.findMany: ${JSON.stringify(where)}`);
      let filtered = [...mockTransactions];
      if (where?.userId) filtered = filtered.filter((t: any) => t.userId === where.userId);
      if (orderBy?.createdAt === "desc") {
        filtered.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
      return filtered;
    },
    create: async ({ data }: any) => {
      const newTx = {
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        status: "COMPLETED",
        ...data
      };
      mockTransactions.push(newTx);
      saveDb();
      return newTx;
    }
  },
  bid: {
    findMany: async ({ where, orderBy, include }: any = {}) => {
      console.log(`[MOCK DB] bid.findMany: ${JSON.stringify(where)}`);
      let allBids: any[] = [];

      mockProjects.forEach((p: any) => {
        (p.bids || []).forEach((b: any) => {
          let matches = true;
          if (where?.freelancerId && b.freelancerId !== where.freelancerId) matches = false;
          if (where?.projectId && b.projectId !== where.projectId) matches = false;
          if (where?.id && where.id?.not && b.id === where.id.not) matches = false;
          if (where?.id && typeof where.id === 'string' && b.id !== where.id) matches = false;

          if (matches) {
            let bidWithData = { ...b };

            // Handle project include
            if (include?.project) {
              bidWithData.project = p;
            }

            // Handle freelancer include
            if (include?.freelancer) {
              const freelancer = mockUsers.find((u: any) => u.id === b.freelancerId);
              if (freelancer) {
                // Return only specific fields if it's a select, otherwise full object (simulating prisma)
                const selectFields = include.freelancer.select;
                if (selectFields) {
                  bidWithData.freelancer = {};
                  Object.keys(selectFields).forEach(key => {
                    bidWithData.freelancer[key] = freelancer[key];
                  });
                } else {
                  bidWithData.freelancer = freelancer;
                }
              }
            }

            allBids.push(bidWithData);
          }
        });
      });

      if (orderBy?.createdAt === "desc") {
        allBids.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }

      return allBids;
    },
    findFirst: async ({ where, include }: any = {}) => {
      let allBids: any[] = [];
      let foundProject: any = null;
      mockProjects.forEach((p: any) => {
        if (p.bids) {
          p.bids.forEach((b: any) => {
            allBids.push({ ...b, project: p }); // attach project reference for convenience
            if (b.id === where.id || (b.projectId === where.projectId && b.freelancerId === where.freelancerId)) {
              foundProject = p;
            }
          });
        }
      });

      let foundBid = allBids.find((b: any) => {
        if (where.id) return b.id === where.id;
        return b.projectId === where.projectId && b.freelancerId === where.freelancerId
      });

      if (foundBid) {
        if (include?.project) foundBid.project = foundProject;
        if (include?.freelancer) {
          foundBid.freelancer = mockUsers.find((u: any) => u.id === foundBid.freelancerId);
        }
        return foundBid;
      }
      return null;
    },
    findUnique: async ({ where, include }: any = {}) => {
      return prismaMock.bid.findFirst({ where, include });
    },
    create: async ({ data }: any) => {
      const project = mockProjects.find((p: any) => p.id === data.projectId);
      const newBid = { id: Math.random().toString(36).substring(7), createdAt: new Date(), status: "PENDING", ...data };
      if (project) {
        if (!project.bids) project.bids = [];
        project.bids.push(newBid);
        saveDb();
      }
      return newBid;
    },
    update: async ({ where, data }: any) => {
      console.log(`[MOCK DB] bid.update: ${where.id}`);
      let updatedBid = null;
      mockProjects.forEach((p: any) => {
        if (p.bids) {
          const index = p.bids.findIndex((b: any) => b.id === where.id);
          if (index !== -1) {
            p.bids[index] = { ...p.bids[index], ...data };
            updatedBid = p.bids[index];
            saveDb();
          }
        }
      });
      return updatedBid;
    },
    updateMany: async ({ where, data }: any) => {
      console.log(`[MOCK DB] bid.updateMany: ${JSON.stringify(where)}`);
      let count = 0;
      mockProjects.forEach((p: any) => {
        if (p.bids) {
          p.bids.forEach((b: any) => {
            let matches = true;
            if (where.projectId && b.projectId !== where.projectId) matches = false;
            // Handle simple 'not' filter
            if (where.id?.not && b.id === where.id.not) matches = false;

            if (matches) {
              Object.assign(b, data);
              count++;
            }
          });
          if (count > 0) saveDb();
        }
      });
      return { count };
    }
  },
  bidStatusHistory: {
    create: async ({ data }: any) => ({ id: Math.random().toString(), ...data }),
  },
  $transaction: async (promises: Promise<any>[]) => {
    console.log("[MOCK DB] Starting Transaction...");
    const results = [];
    for (const promise of promises) {
      try {
        // In a real prisma client, these are closures/thunks, but here we might be passing already-called promises.
        // However, our mocks return values immediately, so if the route calls prisma.x.y(), it executes immediately.
        // To properly mock transaction in this style where calls are awaited inside the route, 
        // we actually can't easily defer execution unless we change the route to pass thunks.
        // BUT, since our mock is synchronous-ish and strictly serial in memory, 
        // waiting for them sequentially here (or even if they already ran) is effectively the same 
        // as long as we don't need rollback logic.
        // The route passes an array of pending promises.
        const res = await promise;
        results.push(res);
      } catch (e) {
        console.error("[MOCK DB] Transaction failed", e);
        throw e;
      }
    }
    console.log("[MOCK DB] Transaction Committed.");
    return results;
  },
  message: {
    create: async ({ data }: any) => {
      if (!(globalThis as any).mockMessages) (globalThis as any).mockMessages = [];
      const newMsg = { id: Math.random().toString(36).substring(7), createdAt: new Date(), ...data };
      (globalThis as any).mockMessages.push(newMsg);
      saveDb();
      return newMsg;
    },
    findMany: async ({ where, orderBy }: any = {}) => {
      if (!(globalThis as any).mockMessages) (globalThis as any).mockMessages = [];

      let filtered = [...(globalThis as any).mockMessages];

      // Logic: (senderId = A AND receiverId = B) OR (senderId = B AND receiverId = A)
      if (where.OR) {
        filtered = filtered.filter(msg => {
          return where.OR.some((condition: any) => {
            let match = true;
            if (condition.senderId && msg.senderId !== condition.senderId) match = false;
            if (condition.receiverId && msg.receiverId !== condition.receiverId) match = false;
            return match;
          });
        });
      }

      if (orderBy?.createdAt === "desc") {
        filtered.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      } else {
        filtered.sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      }

      return filtered;
    }
  },
  $connect: async () => { },
  $disconnect: async () => { },
};

export default prismaMock as any;
