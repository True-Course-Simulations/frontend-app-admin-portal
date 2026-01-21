import React from 'react';
import { CardView, DataTable } from '@openedx/paragon';
import { useSelector } from 'react-redux';

import TableTextFilter from '../learner-credit-management/TableTextFilter';
import CustomDataTableEmptyState from '../learner-credit-management/CustomDataTableEmptyState';
import OrgMemberCard from './OrgMemberCard';
import useEnterpriseMembersTableData from './data/hooks/useEnterpriseMembersTableData';
import DownloadCsvButton from './DownloadCSVButton';

const FilterStatus = (rest) => <DataTable.FilterStatus showFilteredFields={false} {...rest} />;

const PeopleManagementTable = () => {
  const enterpriseId = useSelector(state => state.portalConfiguration.enterpriseId);
  const {
    isLoading: isTableLoading,
    enterpriseMembersTableData,
    fetchEnterpriseMembersTableData,
    fetchAllEnterpriseMembersData,
  } = useEnterpriseMembersTableData({ enterpriseId });

  const tableColumns = [{ Header: 'Name', accessor: 'name' }];
  return (
    <DataTable
      isSortable
      manualSortBy
      isPaginated
      manualPagination
      isFilterable
      manualFilters
      isLoading={isTableLoading}
      defaultColumnValues={{ Filter: TableTextFilter }}
      FilterStatusComponent={FilterStatus}
      numBreakoutFilters={2}
      columns={tableColumns}
      initialState={{
        pageSize: 10,
        pageIndex: 0,
        sortBy: [
          { id: 'name', desc: true },
        ],
        filters: [],
      }}
      fetchData={fetchEnterpriseMembersTableData}
      data={enterpriseMembersTableData.results}
      itemCount={enterpriseMembersTableData.itemCount}
      pageCount={enterpriseMembersTableData.pageCount}
      EmptyTableComponent={CustomDataTableEmptyState}
      tableActions={[
        <DownloadCsvButton
          fetchData={fetchAllEnterpriseMembersData}
          totalCt={enterpriseMembersTableData.itemCount}
          testId="people-report-download"
        />,
      ]}
    >
      <DataTable.TableControlBar />
      <CardView
        className="d-block"
        CardComponent={OrgMemberCard}
        columnSizes={{ xs: 12 }}
      />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default PeopleManagementTable;
