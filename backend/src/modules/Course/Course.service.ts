import { IResponse } from "../../Interfaces/types";
import { ICreateCourseBody } from "./Course.interface";

class CourseService {
  async createCourse(Payload: ICreateCourseBody): Promise<any> {}
}

export default new CourseService();
