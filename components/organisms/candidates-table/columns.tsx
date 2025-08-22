'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '../data-table/data-table-column-header';
import { formatDate } from '@/utils/format-date';
import { toast } from 'sonner';
import { applicationRepository } from '@/repositories/application-repository';
import { DeleteAlert } from '../delete-alert';
import { formatSingleSalary } from '@/utils/format-salary/format-salary';
import { ApplicationTableData } from '../application-table/application-table';

type CandidateData = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const GetCandidatesTableColumns = (
  onDelete: () => void,
  onEditApplication?: (data: ApplicationTableData) => void,
): ColumnDef<CandidateData>[] => {
  const handleDelete = async (id: number) => {
    try {
      await applicationRepository.deleteApplication(id);
      toast.success('Application deleted successfully!');
      onDelete?.();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application. Please try again.');
    }
  };
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="cursor-pointer"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Candidate" />,
      cell: ({ row }) => (
        <>
          <Link
            href={`/hiring/candidates/${row.original.applicantId}`}
            className="font-medium hover:underline cursor-pointer hover:text-blue-500"
          >
            {row.original.fullName}
          </Link>
          <div
            className="text-muted-foreground hover:underline cursor-pointer"
            onClick={() => {
              window.open(`mailto:${row.original.email}`, '_blank');
              toast.success('Email opened in new tab');
            }}
          >
            {row.original.email || 'N/A'}
          </div>
          <div
            className="text-muted-foreground hover:underline cursor-pointer"
            onClick={() => {
              window.open(`tel:${row.original.phone}`, '_blank');
              toast.success('Phone opened in new tab');
            }}
          >
            {row.original.phone || 'N/A'}
          </div>
        </>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.screening?.matchPercentage
            ? row.original.screening?.matchPercentage + '%'
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'accurateKeywords',
      header: 'Skill Match',
      cell: ({ row }) => (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {row.original?.screening?.accurateKeywords.slice(0, 2).map((skill: string) => (
              <Badge key={skill} className="text-xs bg-green-100 text-green-800">
                {skill}
              </Badge>
            ))}
            {row.original?.screening?.accurateKeywords.length > 2 && (
              <Badge className="text-xs">
                +{row.original?.screening?.accurateKeywords.length - 2}
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'yearOfExperience',
      header: 'Year of Experience',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.yearOfExperience > 0 ? row.original.yearOfExperience : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => <div className="text-muted-foreground">{row.original.location}</div>,
    },
    {
      accessorKey: 'expectedSalary',
      header: 'Expected Salary',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {formatSingleSalary(row.original.expectedSalary)}
        </div>
      ),
    },
    {
      accessorKey: 'resumeUrl',
      header: 'Resume',
      cell: ({ row }) => (
        <div>
          {row.original?.documents?.[0]?.document?.filePath ? (
            <Link
              href={row.original?.documents?.[0]?.document?.filePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="font-medium hover:text-primary hover:underline cursor-pointer">
                View Resume
              </div>
            </Link>
          ) : (
            <span className="text-muted-foreground text-sm">No resume</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'appliedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Applied Date" />,
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground">
            {formatDate(row.original.appliedAt.toString())}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                href={`/hiring/candidates/${row.original.applicantId}`}
                className="cursor-pointer"
              >
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEditApplication?.(row.original as unknown as ApplicationTableData)}
            >
              Edit Application
            </DropdownMenuItem>
            <DeleteAlert
              title="Delete Candidate"
              description={`Are you sure you want to delete "${row.original.fullName}"? This action cannot be undone.`}
              action="Delete Candidate"
              onConfirm={() => handleDelete(row.original.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
