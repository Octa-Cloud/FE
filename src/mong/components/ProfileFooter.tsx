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
    <div className="form-actions">
      {!isEditing ? (
        <button type="button" onClick={onEdit} className="edit-button">
          {editText}
        </button>
      ) : (
        <>
          <button 
            type="button" 
            onClick={onSave} 
            disabled={isLoading}
            className="save-button"
          >
            {isLoading ? loadingText : saveText}
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            {cancelText}
          </button>
        </>
      )}
    </div>
  );
});

ProfileFooter.displayName = 'ProfileFooter';

export default ProfileFooter;
