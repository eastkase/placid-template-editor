export interface Template {
  id?: string;
  name: string;
  width: number;
  height: number;
  backgroundColor?: string;
  layers: Layer[];
  outputFormat: 'png' | 'jpg' | 'webp' | 'mp4' | 'gif';
  fps?: number;
  duration?: number;
}

export type Layer = ImageLayer | TextLayer | ShapeLayer | VideoLayer;

export interface BaseLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'video';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  zIndex: number;
  dynamicField?: string;
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src?: string;
  fit: 'cover' | 'contain' | 'fill' | 'none';
  filters?: {
    grayscale?: boolean;
    brightness?: number;
    contrast?: number;
    blur?: number;
    sepia?: boolean;
  };
  mask?: 'none' | 'circle' | 'rounded';
  borderRadius?: number;
  border?: {
    width: number;
    color: string;
  };
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  font: {
    family: string;
    size: number;
    weight?: number | string;
    style?: 'normal' | 'italic';
  };
  color: string;
  alignment: 'left' | 'center' | 'right';
  verticalAlignment: 'top' | 'middle' | 'bottom';
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  textBox: {
    enabled: boolean;
    maxWidth: number;
    maxHeight: number;
    overflow: 'shrink' | 'truncate' | 'ellipsis' | 'wrap';
    minFontSize?: number;
    padding?: { top: number; right: number; bottom: number; left: number };
  };
  
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  stroke?: {
    color: string;
    width: number;
  };
  background?: {
    color: string;
    padding: number;
    borderRadius?: number;
  };
  
  alternateStyle?: {
    enabled: boolean;
    separator: string;
    font?: Partial<TextLayer['font']>;
    color?: string;
  };
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'line' | 'polygon';
  fill?: string;
  stroke?: {
    color: string;
    width: number;
  };
  borderRadius?: number;
  gradient?: {
    type: 'linear' | 'radial';
    colors: { offset: number; color: string }[];
    angle?: number;
  };
  points?: { x: number; y: number }[];
}

export interface VideoLayer extends BaseLayer {
  type: 'video';
  src: string;
  startTime?: number;
  endTime?: number;
  muted?: boolean;
  loop?: boolean;
  fit: 'cover' | 'contain' | 'fill';
  filters?: ImageLayer['filters'];
}