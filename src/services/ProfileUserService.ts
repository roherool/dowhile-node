import prismaClient from "../prisma";

class ProfileUserService {
  async execute(user_id: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: user_id,
      },
    });

    // SELECT * FROM MESSAGES LIMIT 3 ORDER BY CREATED_AT DESC
    return user;
  }
}

export { ProfileUserService };
