import { useQuery } from '@tanstack/react-query';
import fetchProducts from "../lib/fetchProducts"
import fetchDashboardData from '../lib/fetchDashboardData';
import { selectUser } from '../features/user/userSlice';

import { useDispatch, useSelector } from 'react-redux';
const useDashboard = (url, id) => {
  const user = useSelector(selectUser)
  return useQuery({ queryKey: ["dashboard", user?.id], queryFn: () => fetchDashboardData(url) })
};

export default useDashboard;
