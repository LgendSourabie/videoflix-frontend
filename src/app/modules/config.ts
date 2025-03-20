export interface GuestLoginData {
  email: string;
  username: string;
}

export class GuestCredentials {
  GUEST_CREDENTIALS: GuestLoginData = {
    email: 'guest@videoflix.com',
    username: 'guest',
  };
}
