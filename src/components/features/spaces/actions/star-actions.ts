import { FirestoreService } from '@/firebase/firestore';

export interface StarAction {
  type: 'star' | 'unstar';
  spaceId: string;
  userId: string;
  timestamp: Date;
}

export class StarActions {
  /**
   * 標記空間為星標
   */
  static async starSpace(spaceId: string, userId: string) {
    try {
      const starId = `${userId}-${spaceId}`;
      const starData = {
        id: starId,
        userId,
        spaceId,
        createdAt: new Date(),
      };

      await FirestoreService.create('stars', starId, starData);
    } catch (error) {
      throw new Error(`標記星標失敗: ${error}`);
    }
  }

  /**
   * 取消空間星標
   */
  static async unstarSpace(spaceId: string, userId: string) {
    try {
      const starId = `${userId}-${spaceId}`;
      await FirestoreService.delete('stars', starId);
    } catch (error) {
      throw new Error(`取消星標失敗: ${error}`);
    }
  }

  /**
   * 檢查空間是否已標記星標
   */
  static async isSpaceStarred(spaceId: string, userId: string): Promise<boolean> {
    try {
      const starId = `${userId}-${spaceId}`;
      const star = await FirestoreService.get('stars', starId);
      return star !== null;
    } catch (error) {
      console.error('檢查星標狀態失敗:', error);
      return false;
    }
  }

  /**
   * 獲取用戶的所有星標空間
   */
  static async getUserStarredSpaces(userId: string) {
    try {
      const constraints = [{ field: 'userId', operator: '==', value: userId }];
      return await FirestoreService.query('stars', constraints, 'createdAt', 'desc');
    } catch (error) {
      throw new Error(`獲取星標空間失敗: ${error}`);
    }
  }
}
