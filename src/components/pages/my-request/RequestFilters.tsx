'use client'

import { SearchSVG } from "@/components/library/AllSVG";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const filterItems = [{ key: 'all', label: 'All Services' }, { key: 'pending', label: 'Pending Services' }, { key: 'completed', label: 'Completed Services' }]

export default function RequestFilters() {
    const [selectedFilter, setSelectedFilter] = useState('all')
    return (
        <>
            <div className="w-max lg:min-w-75">
                <Input
                    placeholder="Search request..."
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
                            {filterItems.find(item => item.key === selectedFilter)?.label}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="All Services"
                        items={filterItems}
                        selectionMode="single"
                        selectedKeys={[selectedFilter]}
                        onSelectionChange={(keys) => {
                            const key = Array.from(keys as Set<string>)[0];
                            if (key) setSelectedFilter(key);
                        }}
                    >
                        {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                    </DropdownMenu>
                </Dropdown>
            </div>
        </>
    )
}
