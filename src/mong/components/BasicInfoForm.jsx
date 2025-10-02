import React, { useState, useEffect, useRef } from 'react';
import FormField from './FormField';
import ShortFormField from './ShortFormField';
import '../styles/profile.css';

const BasicInfoForm = ({ userData, tempFormData, isEditing, onEdit, onSave, onCancel, onFormDataChange }) => {
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    birthDate: userData.birthDate || '',
    gender: userData.gender || ''
  });

  const nameInputRef = useRef(null);

  // userData가 변경될 때 formData 업데이트 (편집 모드가 아닐 때만)
  useEffect(() => {
    if (!isEditing) {
      console.log('userData changed and not editing:', userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        birthDate: userData.birthDate || '',
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
        birthDate: tempFormData.birthDate || '',
        gender: tempFormData.gender || ''
      });
    } else if (!isEditing) {
      console.log('Not editing, syncing formData with userData');
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        birthDate: userData.birthDate || '',
        gender: userData.gender || ''
      });
    }
  }, [isEditing, tempFormData, userData]);

  // 편집 모드가 활성화될 때 첫 번째 입력 필드에 포커스
  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [isEditing]);

  const handleInputChange = (e) => {
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
  const handleShortFormChange = (fieldName) => (e) => {
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

  const handleSubmit = () => {
    console.log('Save button clicked, formData:', formData);
    console.log('Current formData state:', {
      name: formData.name,
      email: formData.email,
      birthDate: formData.birthDate,
      gender: formData.gender
    });
    
    // 모든 필드 수정 허용 - 이름 필드 수정 불필요
    onSave(formData);
  };

  const handleCancel = () => {
    console.log('Cancel button clicked, resetting form data');
    // 원래 데이터로 되돌리기
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      birthDate: userData.birthDate || '',
      gender: userData.gender || ''
    });
    onCancel();
  };

  return (
    <div className={`basic-info-form ${isEditing ? 'editing' : ''}`}>
      <div className="basic-info-header">
        <div className="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h4 className="basic-info-title">기본 정보</h4>
        <p className="basic-info-description">개인정보를 수정할 수 있습니다</p>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()} className="basic-info-content">
        <div className="form-fields">
          <FormField
            ref={nameInputRef}
            label="이름"
            id="name"
            type="text"
            placeholder="이름을 입력하세요"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="profile-form-field"
          />
          
          <FormField
            label="이메일"
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="profile-form-field"
          />
          
          <div className="form-row">
            <FormField
              label="생년월일"
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-form-field"
            />
            
            <ShortFormField
              label="성별"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleShortFormChange('gender')}
              disabled={!isEditing}
              options={[
                { value: '', label: '선택하세요' },
                { value: 'male', label: '남자' },
                { value: 'female', label: '여자' },
                { value: 'other', label: '기타' }
              ]}
              className="profile-form-field"
            />
          </div>
        </div>
        
        <div className="form-actions">
          {!isEditing ? (
            <button type="button" onClick={onEdit} className="edit-button">
              수정
            </button>
          ) : (
            <>
              <button type="button" onClick={handleSubmit} className="save-button">
                저장
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                취소
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default BasicInfoForm;
