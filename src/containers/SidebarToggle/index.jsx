import { useDispatch, useSelector } from 'react-redux';

import SidebarToggle from '../../components/SidebarToggle';

import {
  expandSidebar,
  collapseSidebar,
} from '../../data/actions/sidebar';

const SidebarToggleContainer = (props) => {
  const dispatch = useDispatch();
  const isExpandedByToggle = useSelector(state => state.sidebar.isExpandedByToggle);

  const expandSidebarAction = () => dispatch(expandSidebar(true));
  const collapseSidebarAction = () => dispatch(collapseSidebar(true));

  return (
    <SidebarToggle
      {...props}
      isExpandedByToggle={isExpandedByToggle}
      expandSidebar={expandSidebarAction}
      collapseSidebar={collapseSidebarAction}
    />
  );
};

export default SidebarToggleContainer;
