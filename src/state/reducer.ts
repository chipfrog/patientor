import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

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
    }
  | {
      type: "SET_DIAGNOSES";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      payload: { patientId: string; entry: Entry };
      // payload: {patient: Patient; entry: Entry};
      // payload: { entry: Entry; id: string };
    };

export const addEntryToPatient = (patientId: string, entry: Entry) => {
  return {
    type: "ADD_ENTRY" as const,
    payload: { patientId, entry }
  };
};
    
// export const addEntryToPatient = (entry: HealthCheckEntry, id: string) => {
//   return {
//     type: "ADD_ENTRY" as const,
//     payload: {
//       entry,
//       id
//     }
//   };
// };

export const setPatientList = (patients: Patient[]) => {
  return {
    type: "SET_PATIENT_LIST" as const,
    payload: patients
  };
};

export const setDiagnoseList = (diagnoses: Diagnosis[]) => {
  return {
    type: "SET_DIAGNOSES" as const,
    payload: diagnoses
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
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    
    case "SET_DIAGNOSES":
      return {
        ...state,
        patients: {
          ...state.patients
        },
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        } 

      };
    case "ADD_ENTRY":
      return {
        ...state,
        [action.payload.patientId]: {
          ...state.patients[action.payload.patientId],
          entries: [
            ...state.patients[action.payload.patientId].entries,
            action.payload.entry
          ]
        }

        // ...state,
        // patients: {
        //   ...state.patients,
        //   [action.payload.patient.id]: {
        //     ...state.patients[action.payload.patient.id], 
        //     entries: {
        //       ...action.payload.patient.entries, 
        //       ...action.payload.entry
        //     }  
        //   }
        // }
      };  
    default:
      return state;
  }
};
