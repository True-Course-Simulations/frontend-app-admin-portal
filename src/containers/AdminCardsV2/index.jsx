import AdminCards from '../../components/AdminV2/AdminCards';
import { useSelector } from 'react-redux';

const AdminCardsContainer = () => {
  const {
    activeLearners,
    enrolledLearners,
    numberOfUsers,
    courseCompletions,
  } = useSelector(state => ({
    activeLearners: state.dashboardAnalytics.active_learners,
    enrolledLearners: state.dashboardAnalytics.enrolled_learners,
    numberOfUsers: state.dashboardAnalytics.number_of_users,
    courseCompletions: state.dashboardAnalytics.course_completions,
  }));

  return (
    <AdminCards
      activeLearners={activeLearners}
      enrolledLearners={enrolledLearners}
      numberOfUsers={numberOfUsers}
      courseCompletions={courseCompletions}
    />
  );
};

export default AdminCardsContainer;
