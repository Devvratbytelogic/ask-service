'use client'

import { FiCheck } from 'react-icons/fi'
import { components, type OptionProps } from 'react-select'
import type { CategoryGroup, CategoryOption } from './selectStyles'

export function CategoryOptionImage({ label, image }: { label: string; image: string | null }) {
    if (image) {
        return (
            <img
                src={image}
                alt={label}
                style={{
                    width: 28,
                    height: 28,
                    objectFit: 'contain',
                    borderRadius: 6,
                    flexShrink: 0,
                    background: 'var(--color-slate-100)',
                }}
            />
        )
    }

    return (
        <div
            style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'var(--color-slate-100)',
                flexShrink: 0,
            }}
        />
    )
}

export function CategorySelectOption(props: OptionProps<CategoryOption, boolean, CategoryGroup>) {
    const { data, isSelected, isFocused } = props

    return (
        <components.Option {...props}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                    style={{
                        width: 16,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isFocused ? '#fff' : 'var(--color-primaryColor)',
                    }}
                    aria-hidden
                >
                    {isSelected ? <FiCheck size={14} strokeWidth={3} /> : null}
                </span>
                <CategoryOptionImage label={data.label} image={data.image} />
                <span style={{ fontSize: 14, fontFamily: 'inherit' }}>{data.label}</span>
            </div>
        </components.Option>
    )
}
