// src/lib/types/gallery-enhanced.ts

import type { GalleryImage, ImageVariant, ImageFormat, ImageSize } from './gallery';

/**
 * Props extendidas para o componente ImageGallery
 */
export interface ImageGalleryProps {
  onSelectImage: (image: GalleryImage | GalleryImage[]) => void;
  showUpload?: boolean;
  allowMultiSelect?: boolean;
  maxSelections?: number;
  filterByTags?: string[];
  showStats?: boolean;
  readOnly?: boolean;
  compactView?: boolean;
  enableSearch?: boolean;
  enableTagFilter?: boolean;
  customActions?: GalleryAction[];
  theme?: GalleryTheme;
}

/**
 * Ações customizadas para a galeria
 */
export interface GalleryAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  position: 'header' | 'item' | 'selection';
  condition?: (context: GalleryActionContext) => boolean;
  handler: (context: GalleryActionContext) => void | Promise<void>;
}

/**
 * Contexto para ações da galeria
 */
export interface GalleryActionContext {
  selectedImages: GalleryImage[];
  allImages: GalleryImage[];
  currentImage?: GalleryImage;
  galleryState: import('./gallery').GalleryState;
}

/**
 * Tema personalizado da galeria
 */
export interface GalleryTheme {
  layout: 'grid' | 'list' | 'masonry';
  itemsPerRow?: number;
  spacing: 'tight' | 'normal' | 'loose';
  imageAspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
  showImageInfo?: boolean;
  showImageActions?: boolean;
}

/**
 * Configuração de validação para upload
 */
export interface UploadValidationConfig {
  maxFileSize: number; // em bytes
  allowedFormats: ImageFormat[];
  minDimensions?: { width: number; height: number };
  maxDimensions?: { width: number; height: number };
  requireAltText?: boolean;
  requireDescription?: boolean;
  maxTags?: number;
}

/**
 * Resultado de validação de upload
 */
export interface UploadValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Configuração de otimização de imagem
 */
export interface ImageOptimizationConfig {
  enableLazyLoading: boolean;
  enableProgressiveLoading: boolean;
  preferredFormats: ImageFormat[];
  generateResponsiveImages: boolean;
  compressionQuality: number;
  enableBlurPlaceholder: boolean;
}

/**
 * Estatísticas de performance da galeria
 */
export interface GalleryPerformanceStats {
  loadTime: number;
  imagesLoaded: number;
  totalImages: number;
  cacheHits: number;
  networkRequests: number;
}

/**
 * Configuração de cache
 */
export interface GalleryCacheConfig {
  enableCache: boolean;
  cacheSize: number; // em MB
  cacheDuration: number; // em minutos
  cacheStrategy: 'memory' | 'localStorage' | 'indexedDB';
}

/**
 * Evento de mudança na galeria
 */
export interface GalleryChangeEvent {
  type: 'selection' | 'filter' | 'search' | 'upload' | 'delete' | 'update';
  data: any;
  timestamp: Date;
}

/**
 * Hook para observar mudanças na galeria
 */
export interface GalleryObserver {
  subscribe: (callback: (event: GalleryChangeEvent) => void) => () => void;
  emit: (event: GalleryChangeEvent) => void;
}

/**
 * Configuração de acessibilidade
 */
export interface GalleryA11yConfig {
  enableKeyboardNavigation: boolean;
  announceChanges: boolean;
  highContrastMode?: boolean;
  reducedMotion?: boolean;
  screenReaderOptimized?: boolean;
}

/**
 * Metadados estendidos para imagem
 */
export interface ExtendedImageMetadata {
  id: string;
  exif?: Record<string, any>;
  colorPalette?: string[];
  dominantColor?: string;
  faces?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  objects?: Array<{
    label: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>;
  textContent?: string;
  generateAltText?: boolean;
}

/**
 * Configuração de busca avançada
 */
export interface AdvancedSearchConfig {
  enableFacetedSearch: boolean;
  searchFields: ('title' | 'description' | 'tags' | 'alt')[];
  enableFuzzySearch: boolean;
  minSearchLength: number;
  searchDebounceMs: number;
}

/**
 * Filtros avançados
 */
export interface AdvancedFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
  dimensions?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
  formats?: ImageFormat[];
  hasDescription?: boolean;
  hasTags?: boolean;
  uploadedBy?: string[];
}

/**
 * Configuração de exportação
 */
export interface ExportConfig {
  formats: ('json' | 'csv' | 'xml')[];
  includeMetadata: boolean;
  includeVariants: boolean;
  compressionLevel?: number;
}

/**
 * Estado de sincronização com backend
 */
export interface SyncState {
  lastSync: Date | null;
  pendingUploads: string[];
  failedUploads: string[];
  syncInProgress: boolean;
  conflicts: Array<{
    imageId: string;
    localVersion: GalleryImage;
    remoteVersion: GalleryImage;
  }>;
}

/**
 * Configuração de sincronização
 */
export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // em segundos
  retryAttempts: number;
  conflictResolution: 'local' | 'remote' | 'manual';
  enableOfflineMode: boolean;
}

/**
 * Utilitários estendidos para galeria
 */
export interface ExtendedGalleryUtils {
  // Validação
  validateUpload: (file: File, config: UploadValidationConfig) => UploadValidationResult;
  
  // Otimização
  optimizeImage: (file: File, config: ImageOptimizationConfig) => Promise<File>;
  generatePlaceholder: (image: GalleryImage) => string;
  
  // Busca e filtros
  filterImages: (images: GalleryImage[], filters: AdvancedFilters) => GalleryImage[];
  searchImages: (images: GalleryImage[], query: string, config: AdvancedSearchConfig) => GalleryImage[];
  
  // Exportação
  exportGallery: (images: GalleryImage[], config: ExportConfig) => Promise<Blob>;
  
  // Análise
  analyzeImage: (file: File) => Promise<ExtendedImageMetadata>;
  generateInsights: (images: GalleryImage[]) => GalleryInsights;
}

/**
 * Insights da galeria
 */
export interface GalleryInsights {
  totalImages: number;
  totalSize: number;
  averageSize: number;
  formatDistribution: Record<ImageFormat, number>;
  sizeDistribution: Record<ImageSize, number>;
  tagCloudData: Array<{ tag: string; count: number; weight: number }>;
  uploadTrends: Array<{ date: string; count: number }>;
  mostUsedTags: string[];
  largestImages: GalleryImage[];
  recentlyAdded: GalleryImage[];
}

/**
 * Contexto completo da galeria para providers
 */
export interface EnhancedGalleryContext {
  // Estado
  state: import('./gallery').GalleryState;
  syncState: SyncState;
  performanceStats: GalleryPerformanceStats;
  
  // Configurações
  config: import('./gallery').GalleryConfig;
  validationConfig: UploadValidationConfig;
  optimizationConfig: ImageOptimizationConfig;
  cacheConfig: GalleryCacheConfig;
  a11yConfig: GalleryA11yConfig;
  syncConfig: SyncConfig;
  
  // Utilitários
  utils: ExtendedGalleryUtils;
  observer: GalleryObserver;
  
  // Ações
  actions: {
    // CRUD básico
    fetchImages: (params?: import('./gallery').GallerySearchParams) => Promise<void>;
    uploadImage: (data: import('./gallery').ImageUploadData) => Promise<GalleryImage>;
    updateImage: (id: string, data: Partial<GalleryImage>) => Promise<GalleryImage>;
    deleteImage: (id: string) => Promise<void>;
    
    // Busca e filtros
    search: (query: string) => Promise<void>;
    applyFilters: (filters: AdvancedFilters) => Promise<void>;
    clearFilters: () => void;
    
    // Seleção
    selectImage: (id: string) => void;
    selectMultiple: (ids: string[]) => void;
    clearSelection: () => void;
    
    // Sincronização
    sync: () => Promise<void>;
    resolveConflict: (imageId: string, resolution: 'local' | 'remote') => Promise<void>;
    
    // Exportação
    exportSelected: (format: 'json' | 'csv' | 'xml') => Promise<void>;
    exportAll: (format: 'json' | 'csv' | 'xml') => Promise<void>;
    
    // Análise
    generateInsights: () => Promise<GalleryInsights>;
    analyzeUsage: () => Promise<any>;
  };
}