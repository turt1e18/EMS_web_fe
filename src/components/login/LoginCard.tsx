"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/login/Button";
import TextField from "@/components/login/TextField";
import {loginAction} from "@/api/auth/auth.Server";
import {
  Card,
  Form,
  HelperRow,
  LinkA,
  PageCenter,
  Title,
  BottomNote
} from "@/style/LoginStyle";

export default function LoginCard() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * 로그인 함수
   */
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const data = await loginAction({email, password});
      toast.success(`로그인 성공: ${data.user.email}`);
      if (data.user.level === 3 || data.user.level === 4) {
        router.push("/usermainpage"); // 3 혹은 4면 유저 메인 페이지로 이동
      } else if (data.user.level === 1 || data.user.level === 2) {
        router.push("/adminmainpage"); // 1 혹은 2면 관리자 메인 페이지로 이동
      }
    } catch {
      toast.error("로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
      <PageCenter>
        <Card role="region" aria-labelledby="login-title">
          <Title id="login-title">로그인</Title>

          <Form onSubmit={handleLogin}>
            <TextField
                name="email"
                type="email"
                label="이메일"
                placeholder="이메일 입력"
                autoComplete="email"
                required
            />

            <TextField
                name="password"
                type="password"
                label="비밀번호"
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                required
            />

            <Button type="submit" disabled={loading}>
              로그인
            </Button>

            <HelperRow>
              <LinkA href="/forgot-password">비밀번호를 잊으셨나요?</LinkA>
            </HelperRow>
          </Form>
        </Card>

        <BottomNote>
          <span>계정이 없으신가요?</span>
          <LinkA href="/signup">회원가입</LinkA>
        </BottomNote>
      </PageCenter>
  );
}
