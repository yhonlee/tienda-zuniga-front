export interface ResponseGestionEmpleados {
    data:    DataWorkDeparments;
    message: string[];
    error:   null;
    status:  number;
}

export interface DataWorkDeparments {
    departments_of_work: DepartmentsOfWork[];
}

export interface DepartmentsOfWork {
    id:   number;
    name: string;
}


export interface ResponseJobPosition {
    data:    DataJobPosition;
    message: string[];
    error:   null;
    status:  number;
}

export interface DataJobPosition {
    job_positions: JobPosition[];
}

export interface JobPosition {
    id:                 string;
    name:               string;
    id_work_department: number;
}


