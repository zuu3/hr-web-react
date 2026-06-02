export const color = {
  ink: {
    100: '#1D1D1F',
    96: 'rgba(29,29,31,0.96)',
    72: 'rgba(29,29,31,0.72)',
    40: 'rgba(29,29,31,0.40)',
    24: 'rgba(29,29,31,0.24)',
    10: 'rgba(29,29,31,0.10)',
    4: 'rgba(29,29,31,0.04)',
  },
  surface: {
    white: '#FFFFFF',
    subtle: '#F7F7F7',
    dark: '#2D3338',
    darkText: '#FDFDFD',
  },
  onDark: {
    base: '#FFFFFF',
    muted: 'rgba(255,255,255,0.60)',
  },
  status: {
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF',
  },
} as const;

export const radius = {
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
} as const;

export const shadow = {
  card: `${color.ink[10]} 0px 0px 0px 0.5px, rgba(0,0,0,0.04) 0px 1px 4px`,
  cardDark: `rgba(0,0,0,0.12) 0px 0px 0px 0.5px, rgba(0,0,0,0.06) 0px 8px 20px -4px`,
  ringInactive: `${color.ink[10]} 0px 0px 0px 1px inset`,
  ringActive: `${color.ink[24]} 0px 0px 0px 1.5px inset`,
  ringError: `rgba(255,59,48,0.40) 0px 0px 0px 1.5px inset`,
  ringFocus: `${color.ink[40]} 0px 0px 0px 1.5px inset`,
} as const;

export const duration = {
  instant: '0ms',
  short: '150ms',
  default: '240ms',
  long: '400ms',
} as const;

export const easing = {
  outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
} as const;

export const font = {
  family: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif",
  size: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '28px',
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
