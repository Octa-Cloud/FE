import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStatsCard from '../components/ProfileStatsCard';
import BasicInfoForm from '../components/BasicInfoForm';
import '../styles/profile.css';

const ProfileModification = () => {
  const navigate = useNavigate();
  
  // Mock user data - in real app, this would come from props or API
  const [userData, setUserData] = useState({
    name: '김수면',
    email: 'a@a.a',
    avatar: '김',
    averageScore: 85,
    averageSleepTime: 7.2,
    totalDays: 45,
    birthDate: '1990-01-15',
    gender: 'female'
  });

  // 편집 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [tempFormData, setTempFormData] = useState(userData);

  // isEditing 상태 변화 추적
  useEffect(() => {
    console.log('ProfileModification - isEditing state changed:', isEditing);
  }, [isEditing]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleStartSleepRecord = () => {
    // Navigate to sleep recording page
    console.log('Starting sleep record...');
  };

  const handleEdit = () => {
    console.log('Edit button clicked, setting isEditing to true');
    setTempFormData({ ...userData }); // 깊은 복사로 현재 데이터를 임시 데이터에 설정
    setIsEditing(true);
    console.log('isEditing state will be set to true');
  };

  const handleSave = (updatedData) => {
    console.log('Save button clicked', updatedData);
    setUserData(prev => ({
      ...prev,
      ...updatedData
    }));
    setTempFormData({ ...userData, ...updatedData }); // tempFormData도 업데이트
    setIsEditing(false);
    console.log('Profile updated successfully:', updatedData);
    // In real app, you would make an API call here
  };

  const handleCancel = () => {
    console.log('Cancel button clicked');
    setTempFormData({ ...userData }); // 원래 데이터로 되돌리기
    setIsEditing(false);
    console.log('Edit cancelled');
  };

  const handleFormDataChange = (newFormData) => {
    console.log('Form data changed:', newFormData);
    setTempFormData(newFormData);
  };

  return (
    <div className="profile-modification-page">
      <ProfileHeader 
        onBack={handleBack}
        onStartSleepRecord={handleStartSleepRecord}
        userProfile={{
          name: userData.name,
          avatar: userData.avatar
        }}
      />
      
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-content">
            <ProfileStatsCard userData={userData} />
            <BasicInfoForm 
              userData={userData}
              tempFormData={tempFormData}
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onFormDataChange={handleFormDataChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileModification;
