import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request, Response } from "express";
import { AuthService, type AuthTokens } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { AuthenticatedUser } from "./strategies/jwt.strategy";
import {
  REFRESH_COOKIE_NAME,
  clearRefreshCookie,
  setRefreshCookie,
} from "./refresh-cookie.util";

// Límite estricto propio para las rutas más sensibles a fuerza bruta /
// creación masiva de cuentas, por encima del límite global de la app.
const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Throttle(AUTH_THROTTLE)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.register(dto, userAgent);
    setRefreshCookie(res, tokens.refreshToken, this.authService.refreshTtlMs);
    return tokens;
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.login(dto, userAgent);
    setRefreshCookie(res, tokens.refreshToken, this.authService.refreshTtlMs);
    return tokens;
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const refreshToken = resolveRefreshToken(req, dto);
    const tokens = await this.authService.refresh(refreshToken, userAgent);
    setRefreshCookie(res, tokens.refreshToken, this.authService.refreshTtlMs);
    return tokens;
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = resolveRefreshToken(req, dto);
    await this.authService.logout(refreshToken);
    clearRefreshCookie(res);
  }

  // Ruta protegida de referencia: confirma que JwtAuthGuard + el payload del
  // access token funcionan de punta a punta.
  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}

// Web manda el refresh token por cookie httpOnly (nunca en el body); móvil
// lo manda en el body (sin cookies). La cookie gana si, por lo que sea,
// llegaran las dos.
function resolveRefreshToken(req: Request, dto: RefreshDto): string {
  const fromCookie = (req.cookies as Record<string, string> | undefined)?.[
    REFRESH_COOKIE_NAME
  ];
  const token = fromCookie || dto.refreshToken;
  if (!token) {
    throw new BadRequestException("Falta el refresh token");
  }
  return token;
}
