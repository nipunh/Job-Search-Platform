import { Employer } from "./Employer";

export class Job {
    id: string = '';
    employer: Employer = new Employer;
    position: string = '';
    description: string = '';
    location: string = '';
    requirements: string = '';
}