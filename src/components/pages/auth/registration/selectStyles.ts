import type { GroupBase, StylesConfig } from 'react-select'

export type CategoryOption = { value: string; label: string; image: string | null }

export type CategoryGroup = GroupBase<CategoryOption>

export function buildSelectStyles(hasError: boolean): StylesConfig<CategoryOption, boolean, CategoryGroup> {
  return {
    control: (base, state) => ({
      ...base,
      borderRadius: 10,
      borderWidth: 1.5,
      borderStyle: 'solid',
      borderColor: hasError
        ? 'var(--color-red-500)'
        : state.isFocused
          ? 'var(--color-primaryColor)'
          : 'var(--app-border)',
      backgroundColor: hasError
        ? 'var(--color-red-light)'
        : state.isFocused
          ? 'var(--app-card)'
          : 'var(--app-surface)',
      boxShadow: hasError
        ? state.isFocused ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none'
        : state.isFocused
          ? '0 0 0 3px var(--color-primary-dim)'
          : 'none',
      minHeight: 44,
      fontFamily: 'inherit',
      fontSize: 14,
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      '&:hover': {
        borderColor: hasError
          ? 'var(--color-red-500)'
          : state.isFocused
            ? 'var(--color-primaryColor)'
            : 'var(--app-border)',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--app-text-muted)',
      fontSize: 14,
      fontFamily: 'inherit',
    }),
    input: (base) => ({
      ...base,
      fontFamily: 'inherit',
      fontSize: 14,
      color: 'var(--app-text)',
      margin: 0,
      padding: 0,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '4px 14px',
      gap: 4,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'var(--app-text-muted)',
      padding: '0 12px',
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: 'var(--app-border)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 10,
      border: '1.5px solid var(--app-border)',
      backgroundColor: 'var(--app-card)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      zIndex: 20,
      overflow: 'hidden',
    }),
    menuList: (base) => ({
      ...base,
      padding: 6,
    }),
    group: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: 8,
      fontSize: 14,
      fontFamily: 'inherit',
      padding: '8px 10px',
      backgroundColor: state.isFocused ? 'var(--color-primaryColor)' : 'transparent',
      color: state.isFocused ? '#fff' : 'var(--app-text)',
      cursor: 'pointer',
    }),
    groupHeading: (base) => ({
      ...base,
      color: 'var(--app-text-muted)',
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: 0,
      padding: '10px 10px 4px',
      margin: 0,
      cursor: 'default',
      fontFamily: 'inherit',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'var(--color-amber-light)',
      borderRadius: 99,
      overflow: 'hidden',
      margin: '2px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'var(--color-amber-dark)',
      fontSize: 12,
      fontWeight: 600,
      padding: '2px 4px 2px 8px',
      fontFamily: 'inherit',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'var(--color-amber-dark)',
      borderRadius: '0 99px 99px 0',
      paddingRight: 6,
      '&:hover': {
        backgroundColor: 'rgba(245,158,11,0.2)',
        color: 'var(--color-amber-dark)',
      },
    }),
  }
}
