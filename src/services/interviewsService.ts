import { 
  collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, 
  where,
  query
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Interview } from "../types/interview";

const interviewsCollection = collection(db, "interviews");

export const interviewsService = {
  async getAll(userId: string): Promise<Interview[]> {
    const userConstraint = where("userId", "==", userId);

    const q = query(interviewsCollection, userConstraint);

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Interview[];
  },

  async getById(id: string): Promise<Interview | null> {
    const ref = doc(db, "interviews", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Interview;
  },

  async add(data: Omit<Interview, "id">): Promise<string> {
    const res = await addDoc(interviewsCollection, data);
    return res.id;
  },

  async update(id: string, data: Partial<Interview>) {
    const ref = doc(db, "interviews", id);
    await updateDoc(ref, data);
  },

  async remove(id: string) {
    const ref = doc(db, "interviews", id);
    await deleteDoc(ref);
  },
};
