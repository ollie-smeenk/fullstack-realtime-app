import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      name?: string;
      email?: string;
      picture?: string;
    }

    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      logout(callback: (err?: any) => void): void;
    }
  }
}
