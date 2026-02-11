import { hash, compare } from "bcryptjs";
import { sign, verify, JwtPayload } from "jsonwebtoken";

// تعریف اینترفیس برای دیتایی که در توکن ذخیره می‌شود
interface TokenPayload extends JwtPayload {
  id?: string;
  email?: string;
  role?: string;
}

const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

const generateAccessToken = (data: object): string => {
  const secret = process.env.AccessTokenSecretKey;
  if (!secret) throw new Error("AccessTokenSecretKey is not defined");

  const token = sign({ ...data }, secret, {
    expiresIn: "60d", // معمولاً برای اکسس توکن زمان کمتری می‌گذارند، اما طبق کد خودت اصلاح شد
  });
  return token;
};

const verifyAccessToken = (token: string): TokenPayload | boolean => {
  try {
    const secret = process.env.AccessTokenSecretKey;
    if (!secret) return false;

    const tokenPayload = verify(token, secret) as TokenPayload;
    return tokenPayload;
  } catch (err) {
    console.log("Verify Access Token Error ->", err);
    return false;
  }
};

const generateRefreshToken = (data: object): string => {
  const secret = process.env.RefreshTokenSecretKey;
  if (!secret) throw new Error("RefreshTokenSecretKey is not defined");

  const token = sign({ ...data }, secret, {
    expiresIn: "15d",
  });
  return token;
};
const verifyRefreshToken = (token: string): TokenPayload | false => {
  try {
    return verify(token, process.env.RefreshTokenSecretKey!) as TokenPayload;
  } catch {
    return false;
  }
};
// بخش اعتبار سنجی (Regex)
const validateName = (name: string): boolean => {
  const pattern = /^[a-zA-Zآ-ی\s]{2,30}$/;
  return pattern.test(name);
};

const validateEmail = (email: string): boolean => {
  const pattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  return pattern.test(email);
};

const validatePassword = (password: string): boolean => {
  const pattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  return pattern.test(password);
};

const validatePhone = (phone: string): boolean => {
  const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return pattern.test(phone);
};

export {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  validateName,
  validateEmail,
  validatePassword,
  validatePhone,
  verifyRefreshToken,
};
