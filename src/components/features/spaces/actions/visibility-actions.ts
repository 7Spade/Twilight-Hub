import { FirestoreService } from '@/firebase/firestore';

export interface VisibilityAction {
  type: 'set_public' | 'set_private' | 'set_restricted';
  spaceId: string;
  userId: string;
  timestamp: Date;
}

export class VisibilityActions {
  /**
   * 設置空間為公開
   */
  static async setSpacePublic(spaceId: string, userId: string) {
    try {
      await FirestoreService.update('spaces', spaceId, {
        isPublic: true,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`設置空間公開失敗: ${error}`);
    }
  }

  /**
   * 設置空間為私有
   */
  static async setSpacePrivate(spaceId: string, userId: string) {
    try {
      await FirestoreService.update('spaces', spaceId, {
        isPublic: false,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`設置空間私有失敗: ${error}`);
    }
  }

  /**
   * 設置空間為受限訪問
   */
  static async setSpaceRestricted(spaceId: string, userId: string, allowedUsers: string[]) {
    try {
      await FirestoreService.update('spaces', spaceId, {
        isPublic: false,
        restrictedUsers: allowedUsers,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error(`設置空間受限訪問失敗: ${error}`);
    }
  }

  /**
   * 檢查用戶是否有訪問權限
   */
  static async checkAccessPermission(spaceId: string, userId: string): Promise<boolean> {
    try {
      const space = await FirestoreService.get('spaces', spaceId);
      if (!space) return false;

      // 公開空間
      if (space.isPublic) return true;

      // 擁有者
      if (space.ownerId === userId) return true;

      // 成員
      if (space.memberIds?.includes(userId)) return true;

      // 受限用戶
      if (space.restrictedUsers?.includes(userId)) return true;

      return false;
    } catch (error) {
      console.error('檢查訪問權限失敗:', error);
      return false;
    }
  }
}
