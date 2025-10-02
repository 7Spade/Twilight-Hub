// This file is for defining custom TypeScript types and interfaces.
// You can use it to define complex data structures for your application.
// For example:
//
// export interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
// }
//
// Then in your component, you can import and use it like so:
//
// import { UserProfile } from '@/lib/types';
//
// const user: UserProfile = { ... };

import { Timestamp } from "firebase/firestore";

export interface Account {
    id: string;
    type: 'user' | 'organization';
    name: string;
    slug: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
    bio?: string;
    description?: string;
    memberIds?: string[];
    level?: number;
    experience?: number;
    managementScore?: number;
    followingCount?: number;
    followersCount?: number;
    moduleInventory?: { [key: string]: number };
}

export interface Space {
    id: string;
    ownerId: string;
    ownerType: 'user' | 'organization';
    name: string;
    slug: string;
    description: string;
    isPublic: boolean;
    moduleIds?: string[];
    starredByUserIds?: string[];
}

export interface Module {
    id: string;
    name: string;
    description: string;
    icon?: string;
    type: 'user' | 'organization' | 'common';
}

export interface Group {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    memberIds: string[];
}

export interface Item {
    id: string;
    name: string;
    description?: string;
    sku?: string;
    category?: string;
    lowStockThreshold?: number;
    price?: number;
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
}

export interface Stock {
    id: string;
    itemId: string;
    warehouseId: string;
    quantity: number;
}

export interface AuditLog {
    id: string;
    organizationId: string;
    userId: string;
    userName: string;
    userAvatarUrl: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: 'ORGANIZATION' | 'ITEM' | 'WAREHOUSE' | 'MEMBER';
    entityId: string;
    entityTitle: string;
    createdAt: Timestamp;
}

export interface UserAchievement {
    achievementId: string;
    unlockedAt: Timestamp;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
}
