export const STAT_ICONS = {
  users: {
    path: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    viewBox: '0 0 24 24',
  },
  projects: {
    path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    viewBox: '0 0 24 24',
  },
  revenue: {
    path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    viewBox: '0 0 24 24',
  },
  tasks: {
    path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    viewBox: '0 0 24 24',
  },
  active: {
    path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    viewBox: '0 0 24 24',
  },
  inactive: {
    path: 'M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 10h-6',
    viewBox: '0 0 24 24',
  },
  departments: {
    path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    viewBox: '0 0 24 24',
  },
} as const

export const ACTION_ICONS = {
  add: {
    path: 'M12 4v16m8-8H4',
    viewBox: '0 0 24 24',
  },
  edit: {
    path: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    viewBox: '0 0 24 24',
  },
  delete: {
    path: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    viewBox: '0 0 24 24',
  },
  view: {
    path: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    viewBox: '0 0 24 24',
  },
  search: {
    path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    viewBox: '0 0 24 24',
  },
  close: {
    path: 'M6 18L18 6M6 6l12 12',
    viewBox: '0 0 24 24',
  },
  check: {
    path: 'M5 13l4 4L19 7',
    viewBox: '0 0 24 24',
  },
} as const

export const NAVIGATION_ICONS = {
  menu: {
    path: 'M4 6h16M4 12h16M4 18h16',
    viewBox: '0 0 24 24',
  },
  chevronLeft: {
    path: 'M15 19l-7-7 7-7',
    viewBox: '0 0 24 24',
  },
  chevronRight: {
    path: 'M9 5l7 7-7 7',
    viewBox: '0 0 24 24',
  },
  chevronDown: {
    path: 'M19 9l-7 7-7-7',
    viewBox: '0 0 24 24',
  },
  arrowLeft: {
    path: 'M10 19l-7-7m0 0l7-7m-7 7h18',
    viewBox: '0 0 24 24',
  },
  arrowRight: {
    path: 'M14 5l7 7m0 0l-7 7m7-7H3',
    viewBox: '0 0 24 24',
  },
} as const

export type StatIconKey = keyof typeof STAT_ICONS
export type ActionIconKey = keyof typeof ACTION_ICONS
export type NavigationIconKey = keyof typeof NAVIGATION_ICONS

