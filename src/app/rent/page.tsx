"use client";

import Sidebar from "@/components/userMainPage/Sidebar";
import Header from "@/components/userMainPage/Header";
import RentalContent from "@/components/rent/RentalContent";
import {PageLayout, ContentArea, MainContainer} from "@/style/RentStyle";
import {getSessionStatusAction} from "@/api/auth/auth.Server";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function RentPage() {
  const router = useRouter();

  /**
   * 세션 체크 함수
   * 세션이 유효하지 않으면 로그인 페이지로 이동
   */
  async function checkSession() {
    try {
      const data = await getSessionStatusAction();
      if (!data.ok) {
        toast.error("로그아웃되었습니다\n다시 로그인해주세요");
        router.replace("/login");
      }
    } catch {
      toast.error("로그아웃되었습니다\n다시 로그인해주세요");
      router.replace("/login");
    }
  }
  
  useEffect(() => {
    checkSession()
  }, []);

  return (
      <PageLayout>
        <Sidebar currentPath="/rent"/>
        <ContentArea>
          <Header/>
          <MainContainer>
            <RentalContent/>
          </MainContainer>
        </ContentArea>
      </PageLayout>
  );
}
