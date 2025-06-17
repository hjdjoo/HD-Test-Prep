import { questionStore } from "@/src/stores/questionStore";
import { userStore } from "@/src/stores/userStore";
import { usePracticeSessionStore } from "@/src/stores/practiceSessionStore";

/**
 * Testing utility function to reset stores;
 */
export const resetStores = () => {

  questionStore.setState({
    questions: [],
    filteredQuestions: [],
    filter: questionStore.getState().filter,
  });
  usePracticeSessionStore.setState({
    sessionId: null,
    sessionResponses: [],
    sessionQuestions: [],
  });
  userStore.setState({ user: null, bootstrapped: true });

};