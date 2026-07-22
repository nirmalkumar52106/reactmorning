import React, { useState } from 'react';
import UpdateFeesForm from './UpdateFeesForm';
import PayFeesForm from './PayFeesForm';
import FeesHistoryTable from './feeshistory';
import { SidebarHeader } from '../../sidebarheader';


const FeesTabs = () => {
  const [activeTab, setActiveTab] = useState('update');

  return (
    <>
    <SidebarHeader/>
     <div className="fees-management">
      <h1 style={{textAlign : "center" , marginBottom : "30px"}}>Student Fees Management</h1>

      {/* Tab Buttons */}
      <div className="tab-buttons">
        <button
          className={activeTab === 'update' ? 'active' : ''}
          onClick={() => setActiveTab('update')}
        >
          Update Fees Info
        </button>
        <button
          className={activeTab === 'pay' ? 'active' : ''}
          onClick={() => setActiveTab('pay')}
        >
          Pay Fees
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Fees History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'update' && (
        <div className="card-box">
          <UpdateFeesForm />
        </div>
      )}
      {activeTab === 'pay' && (
        <div className="card-box">
          <PayFeesForm />
        </div>
      )}
      {activeTab === 'history' && (
        <div className="card-box">
          <FeesHistoryTable />
        </div>
      )}
    </div>
    
    </>
    
  );
};

export default FeesTabs;
