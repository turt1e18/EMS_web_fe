"use client";

import React from "react";
import {
  CardLink,
  Header,
  ItemName,
  Row,
  Section,
  Due,
  RentalListTheme
} from "@/style/UserMainPageStyle";

import type {
  RentalListColors,
  RentalListProps
} from "@/types/UserMainPageInterface";

/**
 * 대여 목록을 보여주는 컴포넌트
 */
export default function RentalList({
                                     items,
                                     rentalStatus = "rented",
                                     title,
                                     icon,
                                     cardHref
                                   }: RentalListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const c: RentalListColors = RentalListTheme[rentalStatus];

  /**
   *  dueDate를 문자열로 변환하는 함수
   **/
  const formatDueDate = (dueDate: number): string => {
    if (rentalStatus === "overdue") {
      return `${Math.abs(dueDate)}일 연체`;
    }
    if (rentalStatus === "dueSoon") {
      if (dueDate === 0) {
        return "오늘 만기";
      }
      return `${dueDate}일 후 만기`;
    }
    return `${dueDate}일 후 만기`;
  };

  return (
      <CardLink href={cardHref} aria-label={title || ""}>
        <Section $c={c}>
          {(icon || title) && (
              <Header $c={c}>
                {icon && <span className="material-icons-outlined">{icon}</span>}
                {title}
              </Header>
          )}
          <div aria-live="polite">
            {items.map((item, idx) => {
              return (
                  <React.Fragment key={`${item.name}-${idx}`}>
                    <Row>
                      <ItemName>{item.name}</ItemName>
                      <Due $c={c}>{formatDueDate(item.dueDate)}</Due>
                    </Row>
                  </React.Fragment>
              );
            })}
          </div>
        </Section>
      </CardLink>
  );
}
