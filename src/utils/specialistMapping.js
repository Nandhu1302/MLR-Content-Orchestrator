
import { getSpecialistFromIndication } from '@/config/indicationSpecialistMapping';

export class SpecialistMapper {
  /**
   * Auto-populate specialist context from indication
   */
  static populateFromIndication(indication) {
    const specialistInfo = getSpecialistFromIndication(indication);
    if (!specialistInfo) {
      return {};
    }

    return {
      specialistType: specialistInfo.specialistType,
      specialistDisplayName: specialistInfo.specialistDisplayName,
      therapeuticArea: specialistInfo.therapeuticArea
    };
  }

  /**
   * Ensure specialist context is complete for Physician-Specialist audience
   */
  static ensureComplete(primaryAudience, indication, existingContext) {
    // If not physician-specialist audience, return as-is
    if (primaryAudience !== 'Physician-Specialist') {
      return existingContext;
    }

    // If already has specialist type, return as-is
    if (existingContext.specialistType) {
      return existingContext;
    }

    // Populate from indication
    return this.populateFromIndication(indication);
  }

  /**
   * Log specialist context for debugging
   */
  static logContext(context, prefix = '🎯') {
    if (context.specialistType) {
      console.log(`${prefix} Specialist context:`, {
        specialistType: context.specialistType,
        specialistDisplayName: context.specialistDisplayName,
        therapeuticArea: context.therapeuticArea
      });
    }
  }
}