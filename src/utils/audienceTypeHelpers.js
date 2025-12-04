
/**
 * Helper functions to categorize the 8 specific audience types into broader categories
 */

export function isHCPAudience(audience) {
  return [
    'Physician-Specialist',
    'Physician-PrimaryCare',
    'Pharmacist',
    'Nurse-RN',
    'Nurse-NP-PA'
  ].includes(audience);
}

export function isCaregiverAudience(audience) {
  return [
    'Caregiver-Professional',
    'Caregiver-Family'
  ].includes(audience);
}

export function isPhysicianAudience(audience) {
  return [
    'Physician-Specialist',
    'Physician-PrimaryCare'
  ].includes(audience);
}

export function isNurseAudience(audience) {
  return [
    'Nurse-RN',
    'Nurse-NP-PA'
  ].includes(audience);
}

export function getAudienceCategory(audience) {
  if (isHCPAudience(audience)) return 'HCP';
  if (audience === 'Patient') return 'Patient';
  if (isCaregiverAudience(audience)) return 'Caregiver';
  return 'Other';
}
