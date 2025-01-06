import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import createSupabase from "@/utils/supabase/client";

import { Question } from "@/src/stores/questionStore";
import { ClientStudentResponse } from "@/src/queries/GET/getResponsesBySession"

import QuestionImage from "components/practice/Practice.questionImage";

interface ResponseSummaryProps {
  studentResponse: ClientStudentResponse
}

export default function ResponseSummary(props: ResponseSummaryProps) {

  const { studentResponse } = props;

  return (
    <div>

    </div>
  )

}