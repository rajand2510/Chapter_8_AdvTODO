import React from 'react';
import Sidebar from '../Components/Sidebar';
import Completed from '../Components/Completed';
import TodayTask from '../Components/TodayTask';



const Home = () => {

  return (
    <div   className='flex flex-row '>
      <Sidebar />
     <div className='flex justify-between  w-full '>
      <TodayTask/>
     </div>
    </div>
  );
};

export default Home;
