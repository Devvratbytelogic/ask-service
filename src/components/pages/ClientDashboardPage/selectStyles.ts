import type { StylesConfig } from 'react-select'

export type FilterOption = { value: string; label: string }

export function buildDashboardFilterSelectStyles(): StylesConfig<FilterOption, false> {
    return {
        control: (base, state) => ({
            ...base,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: state.isFocused ? 'rgba(27,79,255,0.4)' : 'var(--app-border)',
            backgroundColor: 'var(--app-card)',
            boxShadow: 'none',
            minHeight: 38,
            minWidth: 160,
            fontFamily: 'inherit',
            fontSize: 13,
            cursor: 'pointer',
            '&:hover': {
                borderColor: state.isFocused ? 'rgba(27,79,255,0.4)' : 'var(--app-border)',
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: 'var(--app-text-muted)',
            fontSize: 13,
        }),
        singleValue: (base) => ({
            ...base,
            color: 'var(--app-text-sec)',
            fontSize: 13,
        }),
        input: (base) => ({
            ...base,
            fontSize: 16, // ≥16px prevents iOS Safari focus zoom
            color: 'var(--app-text)',
            margin: 0,
            padding: 0,
        }),
        valueContainer: (base) => ({ ...base, padding: '2px 12px' }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? 'var(--app-text-sec)' : 'var(--app-text-muted)',
            padding: '0 8px',
            ':hover': { color: 'var(--app-text)' },
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? 'var(--app-text-sec)' : 'var(--app-text-muted)',
            padding: '0 4px',
            cursor: 'pointer',
            ':hover': { color: 'var(--app-text)' },
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        menu: (base) => ({
            ...base,
            borderRadius: 8,
            border: '1px solid var(--app-border)',
            backgroundColor: 'var(--app-card)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 20,
            overflow: 'hidden',
        }),
        menuList: (base) => ({ ...base, padding: 4 }),
        option: (base, state) => ({
            ...base,
            borderRadius: 6,
            fontSize: 13,
            padding: '8px 10px',
            backgroundColor: state.isSelected
                ? 'rgba(27,79,255,0.1)'
                : state.isFocused
                    ? 'var(--app-elevated)'
                    : 'transparent',
            color: state.isSelected ? 'var(--color-primaryColor)' : 'var(--app-text-sec)',
            fontWeight: state.isSelected ? 600 : 400,
            cursor: 'pointer',
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    }
}
