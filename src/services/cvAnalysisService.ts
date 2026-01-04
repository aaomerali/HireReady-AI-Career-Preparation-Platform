import { 
  collection, getDocs, addDoc, doc, getDoc, deleteDoc, 
  where, query, serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";
import type {CVFile} from '../types/resume'

const cvFilesCollection = collection(db, "cv_files");

export const cvAnalysisService = {
  // جلب قائمة السير الذاتية (بدون النتائج الثقيلة)
  async getAll(userId: string): Promise<CVFile[]> {
    const q = query(
      cvFilesCollection, 
      where("userId", "==", userId),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as CVFile[];
  },

  async getById(id: string): Promise<CVFile | null> {
    const ref = doc(db, "cv_files", id);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as CVFile : null;
  },

  async add(data: Omit<CVFile, "id" | "createdAt">): Promise<string> {
    const res = await addDoc(cvFilesCollection, {
        ...data,
        createdAt: serverTimestamp() // استخدام وقت السيرفر
    });
    return res.id;
  },

  async remove(id: string) {
    const ref = doc(db, "cv_files", id);
    await deleteDoc(ref);
    // ملاحظة: يفضل لاحقاً إضافة منطق لحذف التحليل المرتبط بهذا الملف من جدول cv_results أيضاً
  },
};