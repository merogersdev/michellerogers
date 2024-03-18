import createError from 'http-errors';
import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import handleGenerateAuthToken, { handleGenerateRefreshToken } from '../util/token.util';
import jwt from 'jsonwebtoken';
import { testEmail, testPassword } from '../util/regex.util';

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: { email: string; password: string } = req.body;

  const validEmail = testEmail(email);
  const validPassword = testPassword(password);

  // Validate user input
  if (!validEmail || !validPassword) {
    next(createError(400, 'Invalid Login. Email must be valid, and password must be between 8 and 25 characters long'));
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      next(createError(404, 'User not found'));
      return;
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      next(createError(400, 'Invalid password'));
      return;
    }

    const id = String(user._id);

    return res
      .status(200)
      .cookie('refreshToken', handleGenerateRefreshToken(id), { httpOnly: true, sameSite: 'strict' })
      .json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        authtoken: handleGenerateAuthToken(id),
      });
  } catch (error) {
    next(error);
    return null;
  }
};

export const handleRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken: string = req.cookies.refreshToken;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    next(createError(500, 'No JWT Secret Defined'));
    return;
  }

  if (!refreshToken) {
    next(createError(401, 'No Refresh Token'));
    return;
  }

  try {
    const decoded: any = jwt.verify(refreshToken, jwtSecret);
    if (!decoded) {
      next(createError(500, 'No JWT Secret Defined'));
      return;
    }

    const userExists = await User.findById(decoded.id).select('-password');

    if (!userExists) {
      next(createError(404, 'User not found'));
      return;
    }

    const id = String(decoded.id);

    res
      .header('Authorization', handleGenerateAuthToken(id))
      .status(200)
      .json({
        _id: userExists._id,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        email: userExists.email,
        authtoken: handleGenerateAuthToken(id),
      });
  } catch (error) {
    next(error);
    return null;
  }
};