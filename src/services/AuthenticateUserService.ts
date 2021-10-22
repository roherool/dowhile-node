import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";
/**
 * Receber code (string)
 * Recuperar o access_token no github
 * Verificar se o usuário existe no DB
 * -- SIM = Gera um token
 * -- NÃO = Cria no DB e gera um token
 * Retornar o token com as infos do user
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}

class AuthenticateUserService {
  // Receber o código do Github
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    // Recuperando o access_token do github
    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

    // Verificando as infos do user
    const response = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    // Verifica se existe o usuário do github
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          login,
          github_id: id,
          avatar_url,
          name,
        },
      });
    }

    // Cria o usuário se não existir
    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService };
