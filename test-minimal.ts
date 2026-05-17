
import prismaMock from "./lib/prisma";

async function checkMockDb() {
    console.log("DIAGNOSTIC START");
    const allProjects = await prismaMock.project.findMany();
    console.log(`FOUND_PROJECTS_COUNT: ${allProjects.length}`);
    for (const p of allProjects) {
        console.log(`PROJECT_ID: ${p.id}, TITLE: ${p.title}, STATUS: ${p.status}`);
    }
    console.log("DIAGNOSTIC END");
}

checkMockDb();
