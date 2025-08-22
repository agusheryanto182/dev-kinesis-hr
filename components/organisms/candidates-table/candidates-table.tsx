'use client';

import * as React from 'react';
import { ApplicantResponseDTO } from '@/types/applicant';
import { GetCandidatesTableColumns } from './columns';
import { DataTable } from '@/components/organisms/data-table/data-table';
import { ApplicationResponseDTO } from '@/types/application';
import { UpdateApplicationModal } from '../update-application-modal';
import { ApplicationTableData } from '../application-table/application-table';

type CandidateData = ApplicantResponseDTO;
interface CandidatesTableProps {
  data: CandidateData[];
  onDelete: () => void;
  isLoading?: boolean;
  onEditApplication?: () => void;
}

export function CandidatesTable({
  data,
  onDelete,
  isLoading,
  onEditApplication,
}: CandidatesTableProps) {
  const [isUpdateApplicationModalOpen, setIsUpdateApplicationModalOpen] = React.useState(false);
  const [selectedApplication, setSelectedApplication] = React.useState<ApplicationTableData | null>(
    null,
  );

  const handleEditApplication = (data: ApplicationTableData) => {
    setSelectedApplication(data);
    setIsUpdateApplicationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateApplicationModalOpen(false);
    setSelectedApplication(null);
  };

  const columns = GetCandidatesTableColumns(onDelete, handleEditApplication);

  return (
    <>
      <DataTable columns={columns} data={data} isLoading={isLoading} showView={false} />
      <UpdateApplicationModal
        onEditApplication={onEditApplication}
        isOpen={isUpdateApplicationModalOpen}
        onOpenChange={setIsUpdateApplicationModalOpen}
        application={selectedApplication as unknown as ApplicationResponseDTO}
        onClose={handleCloseModal}
      />
    </>
  );
}
