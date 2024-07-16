import { User } from './user.model';

export interface Help {
  id?: string;
  meta: string;
  description: string;
  title: string;
  requesterId: string;
  image: File;
  requesterDetails?: User;
  category: string;
}
