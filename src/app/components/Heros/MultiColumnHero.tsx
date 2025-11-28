import { Page } from '@/types'
import React from 'react'
import MaxWidthWrapper from '../MaxWidthWrapper'
import RichText from '../RichText/index'

export const MultiColumnHero: React.FC<Page['hero']> = ({ columns }) => {
    return (
        <div className='w-full pt-40'>
            <MaxWidthWrapper>
                <div className="grid grid-cols-12 gap-6 justify-center items-center">
                    {columns?.map((column, index) => (
                        <div
                            key={index}
                            className={`${getColumnClass(column.width ?? 'auto', columns.length)}`}
                        >
                            <RichText
                                data={column.content}
                                enableGutter={true}
                               
                            />
                        </div>
                    ))}
                </div>
            </MaxWidthWrapper>
        </div>
    )
}

const getColumnClass = (width: string, totalColumns: number): string => {
    if (width === 'auto') {
        switch (totalColumns) {
            case 1:
                return 'col-span-12'
            case 2:
                return 'col-span-12 md:col-span-6'
            case 3:
                return 'col-span-12 md:col-span-6 lg:col-span-4'
            case 4:
                return 'col-span-12 md:col-span-6 lg:col-span-3'
            case 5:
                return 'col-span-12 md:col-span-6 lg:col-span-2'
            case 6:
                return 'col-span-12 md:col-span-6 lg:col-span-2 xl:col-span-2'
            default:
                return 'col-span-12'
        }
    }

    switch (width) {
        case '1/6':
            return 'col-span-12 lg:col-span-2'
        case '1/4':
            return 'col-span-12 md:col-span-3'
        case '1/3':
            return 'col-span-12 md:col-span-4'
        case '1/2':
            return 'col-span-12 md:col-span-6'
        case '2/3':
            return 'col-span-12 md:col-span-8'
        case '3/4':
            return 'col-span-12 md:col-span-9'
        case '5/6':
            return 'col-span-12 md:col-span-10'
        case 'full':
            return 'col-span-12'
        default:
            return 'col-span-12'
    }
}