import { hashPassword } from "../utils/bcrypt";
import { SUPERADMIN_EMAIL, SUPERADMIN_NAME, SUPERADMIN_PASSWORD } from "./env";
import prisma from "./prisma";

async function main() {
    // create roles
    const superAdminRole = await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, name: 'superadmin' }
    });

    const companyAdminRole = await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: { id: 2, name: 'admin' }
    });

    const companyEmployeeRole = await prisma.role.upsert({
        where: { id: 3 },
        update: {},
        create: { id: 3, name: 'employee' }
    });

    // create superadmin initial
    const existingSuperAdmin = await prisma.user.findUnique({ where: { email: SUPERADMIN_EMAIL } })
    if (!existingSuperAdmin) {
        const hasedPassword = await hashPassword(SUPERADMIN_PASSWORD || '12345678')
        await prisma.user.create({
            data: {
                name: SUPERADMIN_NAME || 'Super Admin',
                email: SUPERADMIN_EMAIL || 'superadmin@gmail.com',
                password: hasedPassword,
                roleId: superAdminRole.id
            }
        })
    }

    console.log('Seeding Completed.')
}

main()
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())