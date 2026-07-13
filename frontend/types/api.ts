export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: { field: string; message: string }[];
};

export type LegalRequest = {
  id: string;
  protocol: string;
  fullName: string;
  email: string;
  phone: string;
  document?: string;
  city: string;
  state: string;
  customerType: string;
  legalArea: string;
  contactPreference: string;
  preferredContactTime?: string;
  caseDescription: string;
  status: string;
  createdAt: string;
  attachments: Attachment[];
  notes?: RequestNote[];
  histories?: RequestHistory[];
};

export type Attachment = {
  id: string;
  originalName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
};

export type RequestNote = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; email: string };
};

export type RequestHistory = {
  id: string;
  previousStatus?: string;
  newStatus: string;
  createdAt: string;
  user?: { name: string; email: string };
};

