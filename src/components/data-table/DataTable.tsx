import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Empleado } from '@/types/empleados';

interface DataTableProps {
  data: Empleado[];
  columns: ColumnDef<Empleado>[];
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export function DataTable({ data, columns, parentRef }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Adjusted for uniform card height
    overscan: 3,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      className="relative w-full"
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {virtualRows.map((virtualRow, index) => {
        const row = rows[virtualRow.index] as Row<Empleado>;
        return (
          <div
            key={row.id}
            className="table-row absolute top-0 left-0 w-full p-4"
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div className="table-grid h-full">
              {row.getVisibleCells().map((cell) => (
                <div 
                  key={cell.id} 
                  className="table-cell"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}