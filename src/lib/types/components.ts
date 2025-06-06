// src/lib/types/components.ts

import type { GalleryImage, ImageVariant } from './gallery';

/**
 * Props base para componentes
 */
export interface BaseComponentProps {
  class?: string;
  style?: string;
  id?: string;
}

/**
 * Props para componente de imagem otimizada
 */
export interface OptimizedImageProps extends BaseComponentProps {
  variants: ImageVariant[];
  alt: string;
  title?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  placeholder?: 'blur' | 'empty' | string;
}

/**
 * Props para item da galeria
 */
export interface GalleryItemProps extends BaseComponentProps {
  image: GalleryImage;
  selected?: boolean;
  selectable?: boolean;
  showInfo?: boolean;
  compact?: boolean;
  onClick?: (image: GalleryImage) => void;
  onSelect?: (image: GalleryImage, selected: boolean) => void;
}

/**
 * Props para filtros da galeria
 */
export interface GalleryFiltersProps extends BaseComponentProps {
  tags: string[];
  selectedTags: string[];
  searchTerm: string;
  onTagsChange: (tags: string[]) => void;
  onSearchChange: (term: string) => void;
  onClear: () => void;
}

/**
 * Props para modal de upload
 */
export interface UploadModalProps extends BaseComponentProps {
  show: boolean;
  uploading?: boolean;
  onClose: () => void;
  onUpload: (data: FormData) => Promise<void>;
}

/**
 * Props para paginação
 */
export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
}

/**
 * Props para seleção múltipla
 */
export interface MultiSelectProps extends BaseComponentProps {
  selectedCount: number;
  totalCount: number;
  onUseSelected: () => void;
  onClearSelection: () => void;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

// src/lib/types/utils.ts

/**
 * Função para debounce
 */
export type DebounceFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

/**
 * Configuração de debounce
 */
export interface DebounceOptions {
  delay: number;
  immediate?: boolean;
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validador de arquivo
 */
export interface FileValidator {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Utilitários para formatação
 */
export interface FormatUtils {
  fileSize: (bytes: number) => string;
  date: (date: string | Date, format?: string) => string;
  number: (num: number, decimals?: number) => string;
  currency: (amount: number, currency?: string) => string;
}

/**
 * Utilitários para URLs
 */
export interface UrlUtils {
  buildParams: (params: Record<string, any>) => string;
  parseParams: (search: string) => Record<string, string>;
  isValidUrl: (url: string) => boolean;
  getFileExtension: (filename: string) => string;
}

/**
 * Configuração de tema
 */
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

/**
 * Breakpoints responsivos
 */
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

/**
 * Hook para media queries
 */
export interface UseMediaQuery {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
  breakpoint: keyof Breakpoints;
}

/**
 * Configuração de notificações
 */
export interface NotificationConfig {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  duration: number;
  maxVisible: number;
  pauseOnHover: boolean;
}

/**
 * Tipo de notificação
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

/**
 * Store de notificações
 */
export interface NotificationStore {
  notifications: Notification[];
  add: (notification: Omit<Notification, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
}