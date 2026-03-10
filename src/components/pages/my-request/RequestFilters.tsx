'use client'

import { SearchSVG } from "@/components/library/AllSVG";
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { MdKeyboardArrowDown } from "react-icons/md";

const statusFilterItems = [{ key: 'all', label: 'All Status' }, { key: 'pending', label: 'Pending Services' }, { key: 'completed', label: 'Completed Services' }]

export interface RequestFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    statusFilter: 'all' | 'pending' | 'completed'
    onStatusFilterChange: (key: 'all' | 'pending' | 'completed') => void
    serviceFilter: string
    onServiceFilterChange: (serviceId: string) => void
}

export default function RequestFilters({ search, onSearchChange, statusFilter, onStatusFilterChange, serviceFilter, onServiceFilterChange }: RequestFiltersProps) {
    const { data: serviceCategoriesData } = useGetServiceCategoriesQuery()
    const serviceCategories = serviceCategoriesData?.data ?? []
    const serviceFilterItems = [
        { key: 'all', label: 'All Services' },
        ...serviceCategories.map((cat) => ({ key: cat._id, label: cat.title }))
    ]
    return (
        <>
            <div className="w-max lg:min-w-75">
                <Input
                    placeholder="Search request..."
                    value={search}
                    onValueChange={onSearchChange}
                    classNames={{
                        input: "text-base",
                        inputWrapper: "btn_radius bg-white! border-1 border-borderDark h-12! shadow-none data-[hover=true]:bg-white! data-[hover=true]:shadow-none group-data-[focus=true]:bg-white! group-data-[focus=true]:shadow-none pe-[6px] ps-4",
                    }}
                    endContent={
                        <div className="cursor-pointer pointer-events-none flex items-center bg-primary rounded-full p-3">
                            <SearchSVG />
                        </div>
                    }
                    type="search"
                />
            </div>
            <div className="w-max lg:min-w-50">
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            className="btn_radius capitalize text-base bg-white! border-1 border-borderDark h-12! w-full shadow-none"
                            endContent={<MdKeyboardArrowDown className="text-xl text-fontBlack ml-10" />}
                        >
                            {serviceFilterItems.find(item => item.key === serviceFilter)?.label ?? 'All Services'}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Service category"
                        items={serviceFilterItems}
                        selectionMode="single"
                        selectedKeys={[serviceFilter]}
                        onSelectionChange={(keys) => {
                            const key = Array.from(keys as Set<string>)[0];
                            if (key) onServiceFilterChange(key);
                        }}
                    >
                        {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="w-max lg:min-w-50">
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            className="btn_radius capitalize text-base bg-white! border-1 border-borderDark h-12! w-full shadow-none"
                            endContent={<MdKeyboardArrowDown className="text-xl text-fontBlack ml-10" />}
                        >
                            {statusFilterItems.find(item => item.key === statusFilter)?.label}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Status filter"
                        items={statusFilterItems}
                        selectionMode="single"
                        selectedKeys={[statusFilter]}
                        onSelectionChange={(keys) => {
                            const key = Array.from(keys as Set<string>)[0];
                            if (key) onStatusFilterChange(key as 'all' | 'pending' | 'completed');
                        }}
                    >
                        {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}
