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
    name: userData.name || '',
    email: userData.email || '',
    birthMonth: userData.birthDate ? userData.birthDate.split('-')[1] || '' : '',
    birthDay: userData.birthDate ? userData.birthDate.split('-')[2] || '' : '',
    birthYear: userData.birthDate ? userData.birthDate.split('-')[0] || '' : '',
    gender: userData.gender || ''
  });

  const nameInputRef = useRef<HTMLInputElement>(null);

  // userData가 변경될 때 formData 업데이트 (편집 모드가 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      console.log('userData changed and not editing:', userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        birthMonth: userData.birthDate ? userData.birthDate.split('-')[1] || '' : '',
        birthDay: userData.birthDate ? userData.birthDate.split('-')[2] || '' : '',
        birthYear: userData.birthDate ? userData.birthDate.split('-')[0] || '' : '',
        gender: userData.gender || ''
      });
    }
  }, [userData, isEditing]);

  // isEditing 상태가 변경될 때 적절한 데이터로 formData 업데이트
  useEffect(() => {
    console.log('isEditing changed:', isEditing);
    if (isEditing && tempFormData) {
      console.log('Starting edit mode, using tempFormData:', tempFormData);
      setFormData({
        name: tempFormData.name || '',
        email: tempFormData.email || '',
        birthMonth: tempFormData.birthDate ? tempFormData.birthDate.split('-')[1] || '' : '',
        birthDay: tempFormData.birthDate ? tempFormData.birthDate.split('-')[2] || '' : '',
        birthYear: tempFormData.birthDate ? tempFormData.birthDate.split('-')[0] || '' : '',
        gender: tempFormData.gender || ''
      });
    } else if (!isEditing) {
      console.log('Not editing, syncing formData with userData');
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        birthMonth: userData.birthDate ? userData.birthDate.split('-')[1] || '' : '',
        birthDay: userData.birthDate ? userData.birthDate.split('-')[2] || '' : '',
        birthYear: userData.birthDate ? userData.birthDate.split('-')[0] || '' : '',
        gender: userData.gender || ''
      });
    }
  }, [isEditing, tempFormData, userData]);

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
    console.log(`Input changed: ${name} = ${value}`);
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  // ShortFormField용 별도 핸들러 (드롭다운에서 사용)
  const handleShortFormChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(`ShortForm changed: ${fieldName} = ${value}`);
    const newFormData = {
      ...formData,
      [fieldName]: value
    };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  // 생년월일 입력 핸들러
  const handleBirthDateChange = (field: 'birthMonth' | 'birthDay' | 'birthYear', value: string) => {
    console.log(`Birth date changed: ${field} = ${value}`);
    const newFormData = {
      ...formData,
      [field]: value
    };
    setFormData(newFormData);
    if (onFormDataChange) {
      onFormDataChange(newFormData);
    }
  };

  const handleSubmit = () => {
    console.log('Save button clicked, formData:', formData);
    console.log('Current formData state:', {
      name: formData.name,
      email: formData.email,
      birthMonth: formData.birthMonth,
      birthDay: formData.birthDay,
      birthYear: formData.birthYear,
      gender: formData.gender
    });
    
    // 생년월일을 YYYY-MM-DD 형식으로 변환
    const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
    const formattedFormData = {
      ...formData,
      birthDate: birthDate
    };
    
    // 모든 필드 수정 허용 - 이름 필드 수정 불필요
    onSave(formattedFormData);
  };

  const handleCancel = () => {
    console.log('Cancel button clicked, resetting form data');
    // 원래 데이터로 되돌리기
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      birthMonth: userData.birthDate ? userData.birthDate.split('-')[1] || '' : '',
      birthDay: userData.birthDate ? userData.birthDate.split('-')[2] || '' : '',
      birthYear: userData.birthDate ? userData.birthDate.split('-')[0] || '' : '',
      gender: userData.gender || ''
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
          <h4 className="text-xl font-semibold text-white m-0">기본 정보</h4>
          <p className="text-sm text-gray-400 mt-1 mb-0">개인정보를 수정할 수 있습니다</p>
        </div>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <BaseInput
            ref={nameInputRef}
            label="이름"
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          
          <BaseInput
            label="이메일"
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 items-start w-full">
            <div className="form-field">
              <label className="form-label" htmlFor="birthDate">
                생년월일
              </label>
              <div className="flex items-center gap-2 w-full max-w-full overflow-hidden">
                <input
                  type="text"
                  className="profile-date-input"
                  placeholder="MM"
                  maxLength={2}
                  value={formData.birthMonth || ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 12)) {
                      handleBirthDateChange('birthMonth', numericValue);
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (val && parseInt(val) < 10) {
                      handleBirthDateChange('birthMonth', val.padStart(2, '0'));
                    }
                  }}
                  disabled={!isEditing}
                  required
                />
                <span className="text-zinc-400 text-base font-medium">/</span>
                <input
                  type="text"
                  className="profile-date-input"
                  placeholder="DD"
                  maxLength={2}
                  value={formData.birthDay || ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 31)) {
                      handleBirthDateChange('birthDay', numericValue);
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (val && parseInt(val) < 10) {
                      handleBirthDateChange('birthDay', val.padStart(2, '0'));
                    }
                  }}
                  disabled={!isEditing}
                  required
                />
                <span className="text-zinc-400 text-base font-medium">/</span>
                <input
                  type="text"
                  className="profile-date-input profile-date-input-year"
                  placeholder="YYYY"
                  maxLength={4}
                  value={formData.birthYear || ''}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    if (numericValue.length <= 4) {
                      handleBirthDateChange('birthYear', numericValue);
                    }
                  }}
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (val && val.length === 4) {
                      const year = parseInt(val);
                      if (year >= 1900 && year <= 2024) {
                        handleBirthDateChange('birthYear', val);
                      } else {
                        handleBirthDateChange('birthYear', '');
                      }
                    } else if (val && val.length < 4) {
                      handleBirthDateChange('birthYear', '');
                    }
                  }}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            
            <SelectInput
              label="성별"
              id="gender"
              value={formData.gender}
              onChange={handleShortFormChange('gender')}
              disabled={!isEditing}
              options={[
                { value: '', label: '선택하세요' },
                { value: '남', label: '남자' },
                { value: '여', label: '여자' }
              ]}
            />
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
