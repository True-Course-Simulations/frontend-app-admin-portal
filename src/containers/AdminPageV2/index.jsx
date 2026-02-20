import { useDispatch, useSelector } from 'react-redux';
import Admin from '../../components/AdminV2';
import { paginateTable } from '../../data/actions/table';
import EnterpriseDataApiService from '../../data/services/EnterpriseDataApiService';
import {
  clearDashboardAnalytics,
  fetchDashboardAnalytics,
} from '../../data/actions/dashboardAnalytics';
import { fetchDashboardInsights, clearDashboardInsights } from '../../data/actions/dashboardInsights';
import { fetchEnterpriseBudgets, clearEnterpriseBudgets } from '../../data/actions/enterpriseBudgets';
import { fetchEnterpriseGroups, clearEnterpriseGroups } from '../../data/actions/enterpriseGroups';

const AdminPageV2Container = () => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    activeLearners,
    enrolledLearners,
    numberOfUsers,
    courseCompletions,
    lastUpdatedDate,
    enterpriseId,
    csv,
    table,
    insightsLoading,
    insights,
    budgetsLoading,
    budgets,
    groupsLoading,
    groups,
  } = useSelector(state => ({
    loading: state.dashboardAnalytics.loading,
    error: state.dashboardAnalytics.error,
    activeLearners: state.dashboardAnalytics.active_learners,
    enrolledLearners: state.dashboardAnalytics.enrolled_learners,
    numberOfUsers: state.dashboardAnalytics.number_of_users,
    courseCompletions: state.dashboardAnalytics.course_completions,
    lastUpdatedDate: state.dashboardAnalytics.last_updated_date,
    enterpriseId: state.portalConfiguration.enterpriseId,
    csv: state.csv,
    table: state.table,
    insightsLoading: state.dashboardInsights.loading,
    insights: state.dashboardInsights.insights,
    budgetsLoading: state.enterpriseBudgets.loading,
    budgets: state.enterpriseBudgets.budgets,
    groupsLoading: state.enterpriseGroups.loading,
    groups: state.enterpriseGroups.groups,
  }));

  return (
    <Admin
      loading={loading}
      error={error}
      activeLearners={activeLearners}
      enrolledLearners={enrolledLearners}
      numberOfUsers={numberOfUsers}
      courseCompletions={courseCompletions}
      lastUpdatedDate={lastUpdatedDate}
      enterpriseId={enterpriseId}
      csv={csv}
      table={table}
      insightsLoading={insightsLoading}
      insights={insights}
      budgetsLoading={budgetsLoading}
      budgets={budgets}
      groupsLoading={groupsLoading}
      groups={groups}
      fetchDashboardAnalytics={(id) => dispatch(fetchDashboardAnalytics(id))}
      clearDashboardAnalytics={() => dispatch(clearDashboardAnalytics())}
      searchEnrollmentsList={() => dispatch(paginateTable('enrollments', EnterpriseDataApiService.fetchCourseEnrollments))}
      fetchDashboardInsights={(id) => dispatch(fetchDashboardInsights(id))}
      clearDashboardInsights={() => dispatch(clearDashboardInsights())}
      fetchEnterpriseBudgets={(id) => dispatch(fetchEnterpriseBudgets(id))}
      clearEnterpriseBudgets={() => dispatch(clearEnterpriseBudgets())}
      fetchEnterpriseGroups={(id) => dispatch(fetchEnterpriseGroups(id))}
      clearEnterpriseGroups={() => dispatch(clearEnterpriseGroups())}
    />
  );
};

export default AdminPageV2Container;
