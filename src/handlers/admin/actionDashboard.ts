import { NextFunction, Request, Response } from 'express';

export async function handleGetActionDashboardList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const actions = await getActionDashboardList();
  res.json(actions);
}

// TODO: implement real
async function getActionDashboardList(): Promise<Action[]> {
  return [
    {
      type: 'tagSuggestion',
      id: 1,
      isProcessed: false,
      timestamp: '2022-10-01T00:00:00.000Z',
      user: {
        username: 'user123',
        userId: 1,
      },
      primaryField: 'Weekend 2',
      secondaryField: 'Add "cute"',
    },
    {
      type: 'comicProblem',
      id: 2,
      isProcessed: false,
      timestamp: '2022-09-30T00:00:00.000Z',
      user: {
        ip: '125.111.26.1',
      },
      primaryField: 'Getting Familiar',
      secondaryField: 'Update missing',
      description:
        'This is the description where I as a user describe the update that is missing. Page A B and C are indeed missing and can be found on https://e621.net/1234677. Long text Long text Long text Long text Long text Long text Long text',
    },
    {
      type: 'comicSuggestion',
      id: 3,
      isProcessed: false,
      timestamp: '2022-09-29T00:00:00.000Z',
      user: {
        username: 'user345',
        userId: 4,
      },
      primaryField: 'Weekend 4 - Zeta-Haru',
      description:
        'Here are the pages i found:\nhttps://e621.net/LONG-linklinkLONG-linklinkLONG-linklink\nhttps://e621.net/LONG-linklinkLONG-linklinkLONG-linklink2\nhttps://e621.net/LONG-linklinkLONG-linklinkLONG-linklink3\nhttps://e621.net/LONG-linklinkLONG-linklinkLONG-linklink4',
    },
    {
      type: 'comicUpload',
      id: 4,
      isProcessed: false,
      timestamp: '2022-09-28T00:00:00.000Z',
      user: {
        username: 'Melon',
        userId: 2,
      },
      primaryField: 'Family Bonds 2 - Zourik',
    },
    {
      type: 'comicUpload',
      id: 5,
      isProcessed: false,
      timestamp: '2022-09-27T00:00:00.000Z',
      user: {
        username: 'user1234',
        userId: 20,
      },
      primaryField: '610 - Braeburned',
      assignedModName: 'Melon',
    },
    {
      type: 'comicUpload',
      id: 6,
      isProcessed: true,
      timestamp: '2022-09-27T00:00:00.000Z',
      user: {
        username: 'user4567',
        userId: 20,
      },
      primaryField: '611 - Braeburned',
      assignedModName: 'Toast',
      verdict: 'Approved - major issues - comment: half of the pages had only patreon resolution',
    },
    {
      type: 'comicSuggestion',
      id: 8,
      isProcessed: true,
      timestamp: '2022-09-26T00:00:00.000Z',
      user: {
        ip: '127.0.0.2',
      },
      primaryField: 'Some good comic long name - Zeta-Haru',
      assignedModName: 'Toast',
      verdict: 'Approved - excellent info',
    },
  ];
}

interface UserOrIP {
  username?: string;
  userId?: number;
  ip?: string;
}

interface Action {
  type: 'tagSuggestion' | 'comicProblem' | 'comicSuggestion' | 'comicUpload';
  id: number;
  primaryField: string;
  secondaryField?: string;
  description?: string;
  isProcessed: boolean;
  timestamp: string;
  assignedModName?: string;
  user: UserOrIP;
  verdict?: string; // the result of the mod processing (eg. "approved", "rejected - comment 'asdasd'")
}
