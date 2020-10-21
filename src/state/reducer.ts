import { State } from "./state";
import { Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT";
      payload: Patient;
    };  

export const setPatientList = (patients: Patient[]) => {
  return {
    type: "SET_PATIENT_LIST" as const,
    payload: patients
  };
};

export const addPatient = (patient: Patient) => {
  return {
    type: "ADD_PATIENT" as const,
    payload: patient
  };
};

export const updatePatient = (patient: Patient) => {
  return {
    type: "UPDATE_PATIENT" as const,
    payload: patient
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "UPDATE_PATIENT":
      return {
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };  
    default:
      return state;
  }
};
