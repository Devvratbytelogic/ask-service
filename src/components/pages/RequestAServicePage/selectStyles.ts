import type { GroupBase, StylesConfig } from 'react-select'

export type ServiceOption = { value: string; label: string; image: string | null }

export type ServiceGroup = GroupBase<ServiceOption>

export type DynOption = { value: string; label: string }

export type PostalOption = {
  value: string
  label: string
  code: string
  name: string
}

export function buildDynSelectStyles<IsMulti extends boolean>(
  hasError: boolean,
): StylesConfig<DynOption, IsMulti> {
  return {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
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
        ? state.isFocused
          ? '0 0 0 3px rgba(239,68,68,0.1)'
          : 'none'
        : state.isFocused
          ? '0 0 0 3px var(--color-primary-dim)'
          : 'none',
      minHeight: 46,
      fontFamily: 'inherit',
      fontSize: 14,
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      '&:hover': {
        borderColor: hasError
          ? 'var(--color-red-500)'
          : state.isFocused
            ? 'var(--color-primaryColor)'
            : 'var(--color-slate-400)',
        backgroundColor: 'var(--app-card)',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--app-text-muted)',
      fontSize: 14,
      fontFamily: 'inherit',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--app-text)',
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
    valueContainer: (base) => ({ ...base, padding: '4px 14px', gap: 4 }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? 'var(--app-text-sec)' : 'var(--app-text-muted)',
      padding: '0 12px',
      ':hover': { color: 'var(--app-text)' },
    }),
    clearIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? 'var(--app-text-sec)' : 'var(--app-text-muted)',
      padding: '0 4px',
      cursor: 'pointer',
      ':hover': { color: 'var(--app-text)' },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: 'var(--app-border)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      border: '1.5px solid var(--app-border)',
      backgroundColor: 'var(--app-card)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      zIndex: 20,
      overflow: 'hidden',
    }),
    menuList: (base) => ({ ...base, padding: 6 }),
    option: (base, state) => ({
      ...base,
      borderRadius: 8,
      fontSize: 14,
      fontFamily: 'inherit',
      padding: '8px 10px',
      backgroundColor: state.isSelected
        ? 'var(--color-primary-dim)'
        : state.isFocused
          ? 'var(--app-elevated)'
          : 'transparent',
      color: state.isSelected ? 'var(--color-primaryColor)' : 'var(--app-text)',
      fontWeight: state.isSelected ? 600 : 400,
      cursor: 'pointer',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'var(--color-primary-dim)',
      borderRadius: 99,
      overflow: 'hidden',
      margin: '2px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'var(--color-primaryColor)',
      fontSize: 12,
      fontWeight: 600,
      padding: '2px 4px 2px 8px',
      fontFamily: 'inherit',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'var(--color-primaryColor)',
      borderRadius: '0 99px 99px 0',
      paddingRight: 6,
      '&:hover': {
        backgroundColor: 'rgba(27,79,255,0.15)',
        color: 'var(--color-primaryColor)',
      },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  } as StylesConfig<DynOption, IsMulti>
}

export function buildPostalSelectStyles(hasError: boolean): StylesConfig<PostalOption, false> {
  const base = buildDynSelectStyles<false>(hasError)
  return {
    ...base,
    dropdownIndicator: (indicatorBase) => ({
      ...indicatorBase,
      color: 'var(--app-text-muted)',
      padding: '0 14px',
      cursor: 'default',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    option: (optionBase, state) => ({
      ...optionBase,
      borderRadius: 0,
      fontSize: 14,
      fontFamily: 'inherit',
      padding: '10px 12px',
      borderBottom: '1px solid var(--app-border-sub)',
      backgroundColor: state.isSelected
        ? 'var(--color-primary-dim)'
        : state.isFocused
          ? 'var(--app-elevated)'
          : 'transparent',
      color: 'var(--app-text)',
      fontWeight: 400,
      cursor: 'pointer',
      ':last-of-type': {
        borderBottom: 'none',
      },
    }),
    menuList: (menuBase) => ({
      ...menuBase,
      padding: 0,
      maxHeight: 280,
    }),
  } as StylesConfig<PostalOption, false>
}

export function buildServiceSelectStyles(
  hasError: boolean,
): StylesConfig<ServiceOption, false, ServiceGroup> {
  return {
    control: (base, state) => ({
      ...base,
      borderRadius: 12,
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
      minHeight: 46,
      fontFamily: 'inherit',
      fontSize: 14,
      transition: 'all 0.15s ease',
      cursor: 'pointer',
      '&:hover': {
        borderColor: hasError
          ? 'var(--color-red-500)'
          : state.isFocused
            ? 'var(--color-primaryColor)'
            : 'var(--color-slate-400)',
        backgroundColor: 'var(--app-card)',
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--app-text-muted)',
      fontSize: 14,
      fontFamily: 'inherit',
    }),
    singleValue: (base) => ({
      ...base,
      color: 'var(--app-text)',
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
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? 'var(--app-text-sec)' : 'var(--app-text-muted)',
      padding: '0 12px',
      ':hover': {
        color: 'var(--app-text)',
      },
    }),
    clearIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? 'var(--app-text-sec)' : 'var(--app-text-muted)',
      padding: '0 4px',
      cursor: 'pointer',
      ':hover': {
        color: 'var(--app-text)',
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: 'var(--app-border)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      border: '1.5px solid var(--app-border)',
      backgroundColor: 'var(--app-card)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
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
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: 8,
      fontSize: 14,
      fontFamily: 'inherit',
      padding: '8px 10px',
      backgroundColor: state.isFocused ? 'var(--color-primaryColor)' : 'transparent',
      color: state.isFocused ? '#fff' : 'var(--app-text)',
      fontWeight: 400,
      cursor: 'pointer',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  }
}
