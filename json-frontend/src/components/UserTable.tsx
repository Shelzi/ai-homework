import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { User } from '@/types/user';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Trash2, MapPin } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onDeleteUser: (id: number) => void;
}

const columnHelper = createColumnHelper<User>();

export function UserTable({ users, onDeleteUser }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-medium">{info.getValue()}</span>
          <span className="text-sm text-gray-500">{info.row.original.email}</span>
        </div>
      ),
    }),
    columnHelper.accessor('address', {
      header: 'Address',
      cell: (info) => (
        <div className="flex flex-col">
          <span>{info.getValue().street}</span>
          <span className="text-sm text-gray-500">
            {info.getValue().city}, {info.getValue().zipcode}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('website', {
      header: 'Website',
      cell: (info) => (
        <a
          href={`https://${info.getValue()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('company.name', {
      header: 'Company',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(info.row.original)}
              >
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Personal Information</h3>
                    <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                    <p><span className="font-medium">Username:</span> {selectedUser.username}</p>
                    <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedUser.phone}</p>
                    <p><span className="font-medium">Website:</span> {selectedUser.website}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Address</h3>
                    <p>{selectedUser.address.street}</p>
                    <p>{selectedUser.address.suite}</p>
                    <p>{selectedUser.address.city}, {selectedUser.address.zipcode}</p>
                    <a
                      href={`https://www.google.com/maps?q=${selectedUser.address.geo.lat},${selectedUser.address.geo.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View on Map
                    </a>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <h3 className="font-semibold">Company</h3>
                    <p><span className="font-medium">Name:</span> {selectedUser.company.name}</p>
                    <p><span className="font-medium">Catch Phrase:</span> {selectedUser.company.catchPhrase}</p>
                    <p><span className="font-medium">Business:</span> {selectedUser.company.bs}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteUser(info.row.original.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b bg-gray-50">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 