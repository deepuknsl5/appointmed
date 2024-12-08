import { createContext, useState } from "react";
import axios  from 'axios'
import {toast} from 'react-toastify'
import emailjs from 'emailjs-com';
export const DoctorContext = createContext()

const DoctorContextProvider = (props) =>{
     
      const backendUrl= import.meta.env.VITE_BACKEND_URL
      
      const [dToken, setDToken] = useState(localStorage.getItem('dToken')?  localStorage.getItem('dToken'):'')
      
      const [appointments, setAppointments] = useState([])
      const [dashData, setDashData]  =  useState(false)
      const [profileData, setProfileData] = useState(false)

      const getAppointments = async () =>{
        try {
          const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers:{dToken}})
          if(data.success){
             setAppointments(data.appointments )
             console.log(data.appointments)
          }else{
            toast.error(data.message)

          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }

      

const completeAppointment = async (appointmentId, userEmail, userName, doctorName, appointmentDate, appointmentTime) => {
  try {
    // Send a request to the backend to mark the appointment as complete
    const { data } = await axios.post(
      backendUrl + '/api/doctor/complete-appointment',
      { appointmentId },
      { headers: { dToken } }
    );

    if (data.success) {
      toast.success(data.message);

      // Email parameters for the EmailJS template
      const templateParams = {
        user_name: userName,
        doctor_name: doctorName,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        user_email: userEmail,
      };

      // Send a completion email using EmailJS
      emailjs
        .send(
          'service_8bi86gi',        // Replace with your EmailJS service ID
          'template_4wc0n3r',       // Replace with your EmailJS template ID
          templateParams,
          'JXZvBf3QUayAh5rgj'              // Replace with your EmailJS user/public key
        )
        .then((response) => {
          toast.success('Completion email sent successfully!');
        })
        .catch((error) => {
          console.error('Failed to send email:', error);
          toast.error('Failed to send completion email.');
        });

      // Refresh the appointments list
      getAppointments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message);
  }
};

const cancelAppointment = async (appointmentId, userEmail, userName, doctorName, slotDate, slotTime) => {
  try {
    // Cancel the appointment on the backend
    const { data } = await axios.post(
      backendUrl + '/api/doctor/cancel-appointment',
      { appointmentId },
      { headers: { dToken } }
    );

    if (data.success) {
      toast.success(data.message);

      // Email parameters for the EmailJS template
      const templateParams = {
        user_name: userName,
        doctor_name: doctorName,
        slot_date: slotDate,
        slot_time: slotTime,
        user_email: userEmail,
      };

      // Send cancellation email using EmailJS
      emailjs
        .send(
          'service_8bi86gi',        // Replace with your EmailJS service ID
          'template_8sae4aa',       // Replace with your EmailJS template ID
          templateParams,
          'JXZvBf3QUayAh5rgj'                  // Replace with your EmailJS user/public key
        )
        .then((response) => {
          toast.success('Cancellation email sent successfully!');
        })
        .catch((error) => {
          console.error('Failed to send email:', error);
          toast.error('Failed to send cancellation email.');
        });

      // Refresh the appointments list
      getAppointments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message);
  }
};

      const getDashData = async ()=>{
        try {
          const {data}  = await axios.get(backendUrl + '/api/doctor/dashboard', {headers:{dToken}})
          if(data.success){
             setDashData(data.dashData)
             console.log(data.dashData)
          }else{
            toast.error(data.message)
          }         
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
      

      const getProfileData = async()=>{
        try {
          const {data} = await axios.get(backendUrl +'/api/doctor/profile', {headers:{dToken}})
          if(data.success){
            setProfileData(data.profileData)
            console.log(data.profileData)

          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }

      const value ={
        dToken, setDToken,
        backendUrl,
        appointments,setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData, setDashData, getDashData,
        profileData, setProfileData,
        getProfileData,
        
      }  
      return (
        <DoctorContext.Provider value={value}> 
            {props.children}
        </DoctorContext.Provider>
      )
}

export default DoctorContextProvider
