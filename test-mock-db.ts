
import prismaMock from "./lib/prisma";

async function checkMockDb() {
    console.log("--- MOCK DB DIAGNOSTIC ---");
    
    // Check projects
    const allProjects = await prismaMock.project.findMany();
    console.log("Total Projects:", allProjects.length);
    console.log("Projects:", JSON.stringify(allProjects, null, 2));
    
    // Check open projects
    const openProjects = await prismaMock.project.findMany({ where: { status: "OPEN" } });
    console.log("Total Open Projects:", openProjects.length);
    
    // Check users
    const allUsers = await prismaMock.user.findMany();
    console.log("Total Users:", allUsers.length);
    console.log("Freelancers:", allUsers.filter((u: any) => u.role === "FREELANCER").length);

    console.log("--- END DIAGNOSTIC ---");
}

checkMockDb();
