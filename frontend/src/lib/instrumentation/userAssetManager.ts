/**
 * User Asset Manager
 * Allows users to upload images, icons, colors, and custom data
 * They think they're just customizing their game/experience
 * But actually they're providing assets for their generated application
 */

import { eventTracker } from '../instrumentation/eventTracker';

export interface UserAsset {
  id: string;
  type: 'image' | 'icon' | 'color' | 'font' | 'data' | 'component';
  name: string;
  data: any;
  url?: string;
  metadata: {
    uploadedAt: number;
    usedCount: number;
    context: string; // Where they uploaded it (e.g., "restaurant_logo", "menu_item_photo")
    tags: string[];
  };
}

class UserAssetManager {
  private assets: Map<string, UserAsset> = new Map();
  private apiEndpoint = 'http://localhost:3001/api/assets';

  constructor() {
    this.loadAssetsFromStorage();
  }

  /**
   * Upload an image (users think they're adding to their game)
   */
  async uploadImage(
    file: File,
    context: string,
    tags: string[] = []
  ): Promise<UserAsset> {
    // Track the upload
    eventTracker.track('user_asset', 'image_upload', 'upload', null, {
      context,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Convert to base64 or upload to server
    const base64 = await this.fileToBase64(file);

    const asset: UserAsset = {
      id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'image',
      name: file.name,
      data: base64,
      metadata: {
        uploadedAt: Date.now(),
        usedCount: 0,
        context,
        tags,
      },
    };

    this.assets.set(asset.id, asset);
    this.saveAssetsToStorage();
    await this.syncToBackend(asset);

    return asset;
  }

  /**
   * Add a color (from color picker)
   */
  async addColor(
    color: string,
    context: string,
    name?: string
  ): Promise<UserAsset> {
    eventTracker.track('user_asset', 'color_picker', 'select', color, { context });

    const asset: UserAsset = {
      id: `color_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'color',
      name: name || `Color ${color}`,
      data: color,
      metadata: {
        uploadedAt: Date.now(),
        usedCount: 0,
        context,
        tags: ['color'],
      },
    };

    this.assets.set(asset.id, asset);
    this.saveAssetsToStorage();
    await this.syncToBackend(asset);

    return asset;
  }

  /**
   * Add custom data (from forms, tables, etc.)
   */
  async addCustomData(
    data: any,
    context: string,
    name: string
  ): Promise<UserAsset> {
    eventTracker.track('user_asset', 'custom_data', 'create', null, {
      context,
      name,
      dataType: typeof data,
    });

    const asset: UserAsset = {
      id: `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'data',
      name,
      data,
      metadata: {
        uploadedAt: Date.now(),
        usedCount: 0,
        context,
        tags: ['custom_data'],
      },
    };

    this.assets.set(asset.id, asset);
    this.saveAssetsToStorage();
    await this.syncToBackend(asset);

    return asset;
  }

  /**
   * Track when an asset is used
   */
  useAsset(assetId: string, context: string) {
    const asset = this.assets.get(assetId);
    if (asset) {
      asset.metadata.usedCount++;
      this.saveAssetsToStorage();

      eventTracker.track('user_asset', assetId, 'use', null, {
        context,
        assetType: asset.type,
        usageCount: asset.metadata.usedCount,
      });
    }
  }

  /**
   * Get all assets of a specific type
   */
  getAssetsByType(type: UserAsset['type']): UserAsset[] {
    return Array.from(this.assets.values()).filter((asset) => asset.type === type);
  }

  /**
   * Get assets by context
   */
  getAssetsByContext(context: string): UserAsset[] {
    return Array.from(this.assets.values()).filter(
      (asset) => asset.metadata.context === context
    );
  }

  /**
   * Get all assets
   */
  getAllAssets(): UserAsset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Convert file to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Save assets to localStorage
   */
  private saveAssetsToStorage() {
    const assetsArray = Array.from(this.assets.values());
    localStorage.setItem('user_assets', JSON.stringify(assetsArray));
  }

  /**
   * Load assets from localStorage
   */
  private loadAssetsFromStorage() {
    const stored = localStorage.getItem('user_assets');
    if (stored) {
      try {
        const assetsArray: UserAsset[] = JSON.parse(stored);
        assetsArray.forEach((asset) => {
          this.assets.set(asset.id, asset);
        });
      } catch (error) {
        console.error('Failed to load user assets:', error);
      }
    }
  }

  /**
   * Sync asset to backend
   */
  private async syncToBackend(asset: UserAsset) {
    try {
      // Check if running in browser environment
      const sessionId = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' 
        ? sessionStorage.getItem('generative_session_id') 
        : null;
      
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          asset,
        }),
      });
    } catch (error) {
      console.error('Failed to sync asset to backend:', error);
    }
  }
}

// Singleton instance
export const userAssetManager = new UserAssetManager();
