import {serverOnly} from "@/api/axios.server";
import {axiosInstance} from "@/api/axiosInstance";

export type LoginPayload = { email: string; password: string };

export type UserResponse = {
  user: {
    ok: boolean;
    email?: string;
    level?: number;
    message: string;
  };
};

export type SessionResponse = {
  ok: boolean;
  sessionId?: string;
  sessionExpiresAt?: string;
};

/** 로그인 응답 + 쿠키 정보를 함께 반환하는 타입 */
export type LoginResult = {
  data: UserResponse;
  cookies: string[];
};

/**
 * 로그인 axios post
 * @param data : LoginPayload
 * @returns LoginResult (응답 데이터 + Set-Cookie 헤더)
 */
export async function login(data: LoginPayload): Promise<LoginResult> {
  const res = await axiosInstance.post<UserResponse>("api/login", data);

  // 백엔드에서 보낸 Set-Cookie 헤더 추출
  const setCookieHeader = res.headers["set-cookie"] || [];

  return {
    data: res.data,
    cookies: setCookieHeader
  };
}

/**
 * 로그아웃 axios post
 * @param cookieHeader 브라우저 쿠키
 * @returns void
 */
export async function logout(cookieHeader?: string): Promise<void> {
  await axiosInstance.post("api/logout", undefined, {
    headers: cookieHeader ? {Cookie: cookieHeader} : {}
  });
}

/**
 * 백엔드에서 ok 상태랑 세션정보 받아오기 axios get
 * @param cookieHeader 브라우저 쿠키
 * @returns SessionResponse
 */
export async function getSessionStatus(
    cookieHeader?: string
): Promise<SessionResponse> {
  const res = await axiosInstance.get<SessionResponse>("api/checkSession", {
    headers: cookieHeader ? {Cookie: cookieHeader} : {}
  });
  return res.data;
}
