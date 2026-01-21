import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Stack } from '@openedx/paragon';
import useBnrSubsidyRequests from './data/hooks/useBnrSubsidyRequests';
import EnterpriseAccessApiService from '../../data/services/EnterpriseAccessApiService';

import RequestsTable from './requests-tab/RequestsTable';
import DeclineBnrSubsidyRequestModal from './requests-tab/DeclineBnrSubsidyRequestModal';
import ApproveBnrSubsidyRequestModal from './requests-tab/ApproveBnrSubsidyRequestModal';
import { BNR_REQUEST_PAGE_SIZE, useBudgetId } from './data';

const BudgetDetailRequestsTabContent = () => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const {
    isLoading,
    bnrRequests,
    fetchBnrRequests,
    refreshRequests,
  } = useBnrSubsidyRequests({ enterpriseId });

  const { subsidyAccessPolicyId } = useBudgetId();
  const [selectedRequest, setSelectedRequest] = useState();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  return (
    <Stack gap={2}>
      <div>
        <h3>Requests</h3>
        <p className="small">Approve or decline requests for learners.</p>
      </div>
      <RequestsTable
        pageCount={bnrRequests.pageCount}
        itemCount={bnrRequests.itemCount}
        data={bnrRequests.results}
        fetchData={fetchBnrRequests}
        tableData={{
          requestStatusCounts: bnrRequests.learnerRequestStateCounts || [],
        }}
        onApprove={(row) => {
          setSelectedRequest(row);
          setIsApproveModalOpen(true);
        }}
        onDecline={(row) => {
          setSelectedRequest(row);
          setIsDeclineModalOpen(true);
        }}
        onRefresh={refreshRequests}
        isLoading={isLoading}
        initialTableOptions={{
          getRowId: row => row.uuid,
        }}
        initialState={{
          pageSize: BNR_REQUEST_PAGE_SIZE,
          pageIndex: 0,
        }}
      />
      {selectedRequest && (
        <>
          {isApproveModalOpen && (
            <ApproveBnrSubsidyRequestModal
              isOpen
              subsidyRequest={selectedRequest}
              enterpriseId={enterpriseId}
              subsidyAccessPolicyId={subsidyAccessPolicyId}
              approveRequestFn={EnterpriseAccessApiService.approveBnrSubsidyRequest}
              onSuccess={() => {
                refreshRequests();
                setIsApproveModalOpen(false);
              }}
              onClose={() => setIsApproveModalOpen(false)}
            />
          )}
          {isDeclineModalOpen && (
            <DeclineBnrSubsidyRequestModal
              isOpen
              subsidyRequest={selectedRequest}
              enterpriseId={enterpriseId}
              declineRequestFn={EnterpriseAccessApiService.declineBnrSubsidyRequest}
              onSuccess={() => {
                refreshRequests();
                setIsDeclineModalOpen(false);
              }}
              onClose={() => setIsDeclineModalOpen(false)}
            />
          )}
        </>
      )}
    </Stack>
  );
};

export default BudgetDetailRequestsTabContent;
