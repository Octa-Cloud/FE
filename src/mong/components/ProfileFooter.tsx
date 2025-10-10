import React from 'react';
import { ProfileFooterProps } from '../types';

const ProfileFooter = React.memo<ProfileFooterProps>(({
  isEditing,
  isLoading = false,
  onEdit,
  onSave,
  onCancel,
  editText = '수정',
  saveText = '저장',
  cancelText = '취소',
  loadingText = '저장 중...'
}) => {
  return (
    <div className="flex gap-3 pt-4 border-t border-gray-700">
      {!isEditing ? (
        <button type="button" onClick={onEdit} className="profile-edit-button">
          {editText}
        </button>
      ) : (
        <>
          <button 
            type="button" 
            onClick={onSave} 
            disabled={isLoading}
            className="profile-edit-button"
          >
            {isLoading ? loadingText : saveText}
          </button>
          <button type="button" onClick={onCancel} className="profile-cancel-button">
            {cancelText}
          </button>
        </>
      )}
    </div>
  );
});

ProfileFooter.displayName = 'ProfileFooter';

export default ProfileFooter;
