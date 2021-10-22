import { Request, Response } from "express";

import { GetLastMessagesService } from "../services/GetLastMassagesService";

class GetLastMessagesController {
  async handle(req: Request, res: Response) {
    const service = new GetLastMessagesService();

    const result = await service.execute();

    return res.json(result);
  }
}

export { GetLastMessagesController };
