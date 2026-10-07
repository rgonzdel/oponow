import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import {
  AuthService,
  type AuthTokens,
  type DatosCuenta,
  type MfaRequerido,
  type ProveedoresDisponibles,
} from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { FacebookLoginDto, GoogleLoginDto } from "./dto/social.dto";
import { MfaReenviarDto, MfaVerificarDto } from "./dto/mfa.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { ComprobarEnlaceDto, OlvidadaDto, RestablecerDto } from "./dto/contrasena.dto";
import { BorrarCuentaDto, CambiarContrasenaDto, CambiarEmailDto, ConfirmarEmailDto } from "./dto/cuenta.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import type { AuthenticatedUser } from "./strategies/jwt.strategy";
import {
  DISPOSITIVO_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  clearDispositivoCookie,
  clearRefreshCookie,
  setDispositivoCookie,
  setRefreshCookie,
} from "./refresh-cookie.util";

// Límite estricto propio para las rutas más sensibles a fuerza bruta /
// creación masiva de cuentas, por encima del límite global de la app.
const AUTH_THROTTLE = { default: { limit: 5, ttl: 60_000 } };
// Cada reenvío manda un correo: más estricto todavía.
const MFA_REENVIO_THROTTLE = { default: { limit: 3, ttl: 10 * 60_000 } };
// "He olvidado mi contraseña" también manda correos.
const OLVIDADA_THROTTLE = { default: { limit: 5, ttl: 10 * 60_000 } };

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
    this.entregarSesion(res, tokens);
    return tokens;
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens | MfaRequerido> {
    const dispositivo =
      (req.cookies as Record<string, string> | undefined)?.[DISPOSITIVO_COOKIE_NAME] || dto.dispositivo;
    const resultado = await this.authService.login(dto, userAgent, dispositivo);
    // Navegador nuevo: todavía no hay sesión, solo el desafío del código.
    if ("mfaRequerido" in resultado) return resultado;
    this.entregarSesion(res, resultado);
    return resultado;
  }

  @Post("mfa/verificar")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async mfaVerificar(
    @Body() dto: MfaVerificarDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.verificarMfa(dto.desafioId, dto.codigo, userAgent);
    this.entregarSesion(res, tokens);
    return tokens;
  }

  @Post("mfa/reenviar")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle(MFA_REENVIO_THROTTLE)
  async mfaReenviar(
    @Body() dto: MfaReenviarDto,
    @Headers("user-agent") userAgent?: string,
  ): Promise<void> {
    await this.authService.reenviarMfa(dto.desafioId, userAgent);
  }

  /** Envía el enlace para elegir contraseña nueva. Siempre 204, exista o
   * no la cuenta. */
  @Post("contrasena/olvidada")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle(OLVIDADA_THROTTLE)
  async contrasenaOlvidada(
    @Body() dto: OlvidadaDto,
    @Headers("user-agent") userAgent?: string,
  ): Promise<void> {
    await this.authService.solicitarRestablecerContrasena(dto.email, userAgent);
  }

  // El token va en el body (no en la URL de la API) para que no quede en
  // los registros de acceso.
  @Post("contrasena/comprobar")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  comprobarEnlace(@Body() dto: ComprobarEnlaceDto): Promise<{ email: string }> {
    return this.authService.comprobarEnlaceContrasena(dto.token);
  }

  @Post("contrasena/restablecer")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async restablecerContrasena(
    @Body() dto: RestablecerDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.restablecerContrasena(dto.token, dto.password, userAgent);
    this.entregarSesion(res, tokens);
    return tokens;
  }

  // ===== Mi cuenta =====

  @Get("cuenta")
  @UseGuards(JwtAuthGuard)
  cuenta(@CurrentUser() user: AuthenticatedUser): Promise<DatosCuenta> {
    return this.authService.datosCuenta(user.id);
  }

  @Post("cuenta/contrasena")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Throttle(AUTH_THROTTLE)
  async cambiarContrasena(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CambiarContrasenaDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.cambiarContrasena(user.id, dto.actual, dto.nueva, userAgent);
    this.entregarSesion(res, tokens);
    return tokens;
  }

  @Post("cuenta/cerrar-sesiones")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Throttle(AUTH_THROTTLE)
  async cerrarSesiones(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.cerrarOtrasSesiones(user.id, userAgent);
    this.entregarSesion(res, tokens);
    return tokens;
  }

  @Post("cuenta/email")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Throttle(OLVIDADA_THROTTLE)
  async cambiarEmail(@CurrentUser() user: AuthenticatedUser, @Body() dto: CambiarEmailDto): Promise<void> {
    await this.authService.solicitarCambioEmail(user.id, dto.email, dto.password);
  }

  @Post("cuenta/email/confirmar")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  confirmarEmail(@Body() dto: ConfirmarEmailDto): Promise<{ email: string }> {
    return this.authService.confirmarCambioEmail(dto.token);
  }

  @Delete("cuenta")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Throttle(AUTH_THROTTLE)
  async borrarCuenta(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: BorrarCuentaDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.borrarCuenta(user.id, dto.password);
    clearRefreshCookie(res);
    clearDispositivoCookie(res);
  }

  /** Público: qué botones de acceso debe mostrar la web. */
  @Get("proveedores")
  proveedores(): ProveedoresDisponibles {
    return this.authService.proveedoresDisponibles();
  }

  @Post("google")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async google(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.loginGoogle(dto, userAgent);
    setRefreshCookie(res, tokens.refreshToken, this.authService.refreshTtlMs);
    return tokens;
  }

  @Post("facebook")
  @HttpCode(HttpStatus.OK)
  @Throttle(AUTH_THROTTLE)
  async facebook(
    @Body() dto: FacebookLoginDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("user-agent") userAgent?: string,
  ): Promise<AuthTokens> {
    const tokens = await this.authService.loginFacebook(dto.accessToken, userAgent);
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

  /** Cookies de la sesión (refresh) y, si se acaba de emitir, la del
   * navegador de confianza. La app móvil usa los mismos valores del body. */
  private entregarSesion(res: Response, tokens: AuthTokens) {
    setRefreshCookie(res, tokens.refreshToken, this.authService.refreshTtlMs);
    if (tokens.tokenDispositivo) setDispositivoCookie(res, tokens.tokenDispositivo);
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
