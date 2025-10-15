import React, { useState, useEffect, useRef } from 'react';
import BaseInput from './BaseInput';
import SelectInput from './SelectInput';
import ProfileFooter from './ProfileFooter';
import '../styles/profile.css';
import { BasicInfoFormProps } from '../types';

const BasicInfoForm = ({ 
  userData, 
  tempFormData, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onFormDataChange 
}: BasicInfoFormProps) => {
  const [formData, setFormData] = useState({
    name: userData.name || ''
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  // userData가 변경될 때 formData 업데이트 (편집 모드가 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        name: userData.name || ''
      });
    }
  }, [userData, isEditing]);

  // isEditing 상태가 변경될 때 적절한 데이터로 formData 업데이트
  useEffect(() => {
    if (isEditing && tempFormData) {
      setFormData({
        name: tempFormData.name || ''
      });
    } else if (!isEditing) {
      setFormData({
        name: userData.name || ''
      });
    }
  }, [isEditing, userData]);

  // 편집 모드가 활성화될 때 첫 번째 입력 필드에 포커스
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 닉네임만 수정 가능
    if (name === 'name') {
      const newFormData = {
        ...formData,
        [name]: value
      };
      setFormData(newFormData);
      
      // 닉네임만 변경된 데이터를 전달
      const formattedData = {
        name: newFormData.name,
        email: userData.email,
        birthDate: userData.birthDate,
        gender: userData.gender
      };
      
      if (onFormDataChange) {
        onFormDataChange(formattedData);
      }
    }
  };


  const handleSubmit = () => {
    // 닉네임만 수정 가능하도록 제한
    const formattedFormData = {
      name: formData.name,
      email: userData.email, // 원본 유지
      birthDate: userData.birthDate, // 원본 유지
      gender: userData.gender // 원본 유지
    };
    
    onSave(formattedFormData);
  };

  const handleCancel = () => {
    // 원래 데이터로 되돌리기
    setFormData({
      name: userData.name || ''
    });
    onCancel();
  };

  return (
    <div className="basic-info-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400/20 to-primary-600/20 flex items-center justify-center text-primary-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-white m-0">사용자 정보</h4>
          <p className="text-sm text-gray-400 mt-1 mb-0">닉네임을 변경할 수 있습니다</p>
        </div>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <BaseInput
            ref={nameInputRef}
            label="닉네임"
            id="name"
            type="text"
            placeholder="닉네임을 입력하세요"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          
          <div className="form-field">
            <label className="form-label" htmlFor="email">
              이메일
            </label>
            <div className="form-input-readonly">
              {userData.email}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 items-start w-full">
            <div className="form-field">
              <label className="form-label" htmlFor="birthDate">
                생년월일
              </label>
              <div className="form-input-readonly">
                {userData.birthDate || '1990-01-01'}
              </div>
            </div>
            
            <div className="form-field">
              <label className="form-label" htmlFor="gender">
                성별
              </label>
              <div className="form-input-readonly">
                {userData.gender === '남' ? '남자' : userData.gender === '여' ? '여자' : userData.gender}
              </div>
            </div>
          </div>
        </div>
        
        <ProfileFooter
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={handleSubmit}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
};

export default BasicInfoForm;
