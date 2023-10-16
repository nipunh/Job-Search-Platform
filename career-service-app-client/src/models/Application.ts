import { Candidate } from './Candidate';
import { Employer } from './Employer';
import { Job } from './Job'

export class Application {
    [x: string]: {};
    id: string = '';
    job: Job = new Job;
    employer: Employer = new Employer;
    status: string = '';
    candidate: Candidate = new Candidate;
}