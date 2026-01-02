import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import type { Interview } from "../../types/interview";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useEffect, useCallback } from "react";

function Test() {
  const currentUserId = useSelector((state: RootState) => state.auth.user?.uid);

  const interviewsService = useCallback(async () => {
    if (!currentUserId) return;

    const interviewsCollection = collection(db, "interviews");
    const q = query(interviewsCollection, where("userId", "==", currentUserId));
    const snapshot = await getDocs(q);

    const interviews = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Interview[];

    console.log(interviews);
  }, [currentUserId]);

  useEffect(() => {
    interviewsService();
  }, [interviewsService]);

  return (
    <div className="max-w-lg mx-auto py-10 px-4 text-center">
      <button onClick={interviewsService}>run</button>
    </div>
  );
}

export default Test;
