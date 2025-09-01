// Verification utilities for KrishiBondhu

export interface VerificationStatus {
  email_verified: boolean;
  profile_submitted: boolean;
  documents_uploaded: boolean;
  admin_reviewed: boolean;
  status: 'pending' | 'verified' | 'rejected' | 'skipped';
}

export const checkVerificationStatus = (): VerificationStatus => {
  // Check if verification was skipped
  const verificationSkipped = localStorage.getItem('verification_skipped') === 'true';
  
  if (verificationSkipped) {
    return {
      email_verified: true,
      profile_submitted: true,
      documents_uploaded: false,
      admin_reviewed: false,
      status: 'skipped'
    };
  }

  // Mock verification status - in real app, this would come from Supabase
  return {
    email_verified: true,
    profile_submitted: true,
    documents_uploaded: false,
    admin_reviewed: false,
    status: 'pending'
  };
};

export const isVerificationSkipped = (): boolean => {
  return localStorage.getItem('verification_skipped') === 'true';
};

export const clearVerificationSkip = (): void => {
  localStorage.removeItem('verification_skipped');
};

export const setVerificationSkipped = (): void => {
  localStorage.setItem('verification_skipped', 'true');
};

// Check if user has limited access due to skipped verification
export const hasLimitedAccess = (): boolean => {
  return isVerificationSkipped();
};

// Get verification progress percentage
export const getVerificationProgress = (): number => {
  const status = checkVerificationStatus();
  
  if (status.status === 'skipped') {
    return 50; // Show 50% progress for skipped verification
  }
  
  let completed = 0;
  if (status.email_verified) completed += 25;
  if (status.profile_submitted) completed += 25;
  if (status.documents_uploaded) completed += 25;
  if (status.admin_reviewed) completed += 25;
  
  return completed;
};

// Get verification status badge
export const getVerificationBadge = (status: string) => {
  switch (status) {
    case 'verified':
      return { text: 'Verified', className: 'bg-green-100 text-green-800' };
    case 'rejected':
      return { text: 'Rejected', className: 'bg-red-100 text-red-800' };
    case 'skipped':
      return { text: 'Skipped', className: 'bg-orange-100 text-orange-800' };
    default:
      return { text: 'Pending', className: 'bg-gray-100 text-gray-800' };
  }
}; 