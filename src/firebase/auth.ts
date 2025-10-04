import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  User,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './index';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(`登入失敗: ${error}`);
    }
  }

  static async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 更新用戶顯示名稱
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // 創建用戶資料文檔
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        roles: ['user'],
        permissions: ['read:own'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(firestore, 'accounts', user.uid), userProfile);
      return user;
    } catch (error) {
      throw new Error(`註冊失敗: ${error}`);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`登出失敗: ${error}`);
    }
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(firestore, 'accounts', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      throw new Error(`獲取用戶資料失敗: ${error}`);
    }
  }
}