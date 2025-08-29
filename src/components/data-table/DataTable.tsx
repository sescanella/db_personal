import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';
import type { Empleado } from '@/types/empleados';

interface DataTableProps {
  data: Empleado[];
  columns: ColumnDef<Empleado>[];
  parentRef?: React.RefObject<HTMLDivElement | null>;
}

export function DataTable({ data, columns }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  return (
    <div className="w-full max-h-[calc(100vh-280px)] overflow-y-auto table-container">
      <div className="space-y-3 p-4">
        {rows.map((row: Row<Empleado>, index) => (
          <div
            key={row.id}
            className="table-row w-full px-4 py-3 h-30"
            style={{
              animationDelay: `${index * 0.03}s`,
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
        ))}
      </div>
    </div>
  );
}