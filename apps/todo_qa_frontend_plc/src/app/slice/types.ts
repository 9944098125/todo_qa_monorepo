/* --- STATE --- */
export interface GlobalState {
  user: any;
  token: string | null;
  editFeed: {
    _id: string;
    owner: {
      userId: string;
      profilePicture: string;
      name: string;
    };
    title: string;
    description: string;
    images: string[];
    reference: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  editJob: {
    _id: string;
    role: string;
    location: string;
    skills: number[];
    companyLogo: string;
    experience: number[];
    companyName: string;
    basicQualifications: number[];
    appliedUser: any[];
    aboutTheCompany: string;
    aboutTheJob: string;
    salary: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}
