import React, { useEffect } from 'react';
// import Sidebar from '../Components/Sidebar';
import Completed from '../Components/Completed';
import TodayTask from '../Components/TodayTask';
import UpcomingTask from '../Components/UpcomingTask';
import GroupPage from '../Components/GroupPage';
import ProjectPage from '../Components/ProjectPage';
import RendContent from '../Components/RendContent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, selectAllTasks, selectGroups } from '../features/todoSlice';



const Home = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectGroups);
  const status = useSelector(state => state.todo.status);
  const error = useSelector(state => state.todo.error);
  
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  console.log(tasks);

  return (
    <div className='flex flex-row '>
      {/* <Sidebar /> */}
      <div className='flex justify-between  w-full '>
        <RendContent />
      </div>
    </div>
  );
};

export default Home;
