import React, { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TableComponent from '../../components/TableComponent';
import { paginateTable, sortTable, clearTable } from '../../data/actions/table';

const TableContainer = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const {
    enterpriseId,
    data,
    currentPage,
    pageCount,
    ordering,
    loading,
    error,
  } = useSelector((state) => {
    const tableState = state.table[props.id] || {};
    return {
      enterpriseId: state.portalConfiguration.enterpriseId,
      data: tableState.data && tableState.data.results,
      currentPage: tableState.data && tableState.data.current_page,
      pageCount: tableState.data && tableState.data.num_pages,
      ordering: tableState.ordering,
      loading: tableState.loading,
      error: tableState.error,
    };
  });

  const paginateTableAction = (pageNumber) => {
    dispatch(paginateTable(props.id, props.fetchMethod, pageNumber));
  };

  const sortTableAction = (orderingValue) => {
    dispatch(sortTable(props.id, props.fetchMethod, orderingValue));
  };

  const clearTableAction = () => {
    dispatch(clearTable(props.id));
  };

  return (
    <TableComponent
      {...props}
      ref={ref}
      enterpriseId={enterpriseId}
      data={data}
      currentPage={currentPage}
      pageCount={pageCount}
      ordering={ordering}
      loading={loading}
      error={error}
      paginateTable={paginateTableAction}
      sortTable={sortTableAction}
      clearTable={clearTableAction}
    />
  );
});

export default TableContainer;
