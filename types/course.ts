export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  category: string;
  price: number;
  imageUrl: string;
  isPublished: boolean;
  learningObjectives: string[];
  requirements: string[];
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  learningObjectives: string[];
  requirements: string[];
  targetAudience: string[];
}