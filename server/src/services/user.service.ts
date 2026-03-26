import { prisma } from "../lib/prisma"

const userServices = {
    getAllUsers: async () => {
        const users = await prisma.user.findMany()
        return users
    }
}

export default userServices