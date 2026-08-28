import { Feedback } from '../entities/feedback.entity';
import { FeedbackResponse } from '../schemas';

export class FeedbackResponseMapper {
  static toResponse(feedback: Feedback): FeedbackResponse {
    return {
      id: feedback.id,
      code: feedback.code,
      userId: feedback.userId,
      user: feedback.user
        ? {
            id: feedback.user.id,
            phone: feedback.user.phone,
            fullName: feedback.user.fullName,
          }
        : null,
      targetOrganizationId: feedback.targetOrganizationId,
      targetOrganization: feedback.targetOrganization
        ? {
            id: feedback.targetOrganization.id,
            code: feedback.targetOrganization.code,
            name: feedback.targetOrganization.name,
            type: feedback.targetOrganization.type,
          }
        : null,
      incidentVillageId: feedback.incidentVillageId,
      incidentVillage: feedback.incidentVillage
        ? {
            id: feedback.incidentVillage.id,
            code: feedback.incidentVillage.code,
            name: feedback.incidentVillage.name,
          }
        : null,
      categoryId: feedback.categoryId,
      category: feedback.category
        ? {
            id: feedback.category.id,
            code: feedback.category.code,
            name: feedback.category.name,
          }
        : null,
      address: feedback.address,
      title: feedback.title,
      content: feedback.content,
      status: feedback.status,
      attachments: (feedback.attachments || []).map((att) => ({
        id: att.id,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
        createdAt: att.createdAt,
      })),
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    };
  }

  static toResponseList(feedbacks: Feedback[]): FeedbackResponse[] {
    return feedbacks.map((fb) => this.toResponse(fb));
  }
}
