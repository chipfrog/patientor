import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { HealthCheckEntry, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient, addEntryToPatient } from "../state";
import { Button, Card, Icon } from "semantic-ui-react";
import EntryDetails from "../components/EntryDetails";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<HealthCheckEntry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntryToPatient(id, newEntry));
      closeModal();
      // dispatch({ type: "ADD_ENTRY", payload: { newEntry, id });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  React.useState(() => {
    const patientToFetch = Object.values(patients).find(p => p.id === id);
    // mahdollisesti ssn-tarkistusta muutettava uusien entryjen lisäämisen takia
    if (patientToFetch !== undefined && patientToFetch.ssn === undefined) {
      const fetchPatient = async () => {
        try {        
          const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
          dispatch(updatePatient(patientFromApi));
        } catch(error) {
          console.log(error);
        }
      };
      fetchPatient();
    }
  });

  const patient = Object.values(patients).find(p => p.id === id);

  if (patient !== undefined && patient.entries !== undefined) {
    return(
      <div>
        <h1>
          {patient.name} 
          {patient.gender === 'male' && <Icon className="mars" />}
          {patient.gender === 'female' && <Icon className="venus" />}
          {patient.gender === 'other' && <Icon className="genderless" />}
        </h1>
        <p>ssn: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
        <div>
         <h2>entries</h2>
         {patient.entries.map((entry) => (
           <div key={entry.id}>
             <Card.Group>
              <EntryDetails entry={entry} />
            </Card.Group>
           </div>
         ))}
        </div>
        <AddEntryModal 
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Patient</Button>
      </div>
    );
  } 
  else {
    return (
      <div>
        <p>Patient not found</p>
      </div>
    );
  }
};

export default PatientPage;