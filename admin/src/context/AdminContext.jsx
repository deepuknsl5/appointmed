import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
import emailjs from 'emailjs-com';
export const AdminContext = createContext()

const AdminContextProvider = (props) =>{

      const [aToken, setAToken] = useState(localStorage.getItem('aToken')?  localStorage.getItem('aToken'):'')
      const [doctors, setDoctors] = useState([])
      const [appointments, setAppointments] = useState([])
      const [dashData, setDashData] = useState(false)

      const backendUrl = import.meta.env.VITE_BACKEND_URL
       
      const getAllDoctors = async ()=>{
        try{
          const {data} =await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers:{aToken}})
          if(data.success){
            setDoctors(data.doctors)
            console.log(data.doctors)
          }else{
            toast.error(data.message)
          }

        }catch(error){
          toast.error(error.message)

        }
      }

      const changeAvailability = async(docId) =>{
        try {
          const {data} = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {headers:aToken}) 
          if(data.success){
            toast.success(data.message)
            getAllDoctors()
          }else{
            toast.error(data.message)
          }

        } catch (error) {
          toast.error(error.message)
        }
      }

      const getAllAppointments = async ()=>{
        try {
          const {data} = await axios.get(backendUrl + '/api/admin/appointments', {headers:{aToken}})

          if(data.success){
            setAppointments(data.appointments)
            console.log(data.appointments)
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
      
      
      

const cancelAppointment = async (appointmentId, userEmail, userName, doctorName, slotDate, slotTime) => {
  try {
    // Cancel the appointment on the backend
    const { data } = await axios.post(
      backendUrl + '/api/admin/cancel-appointment',
      { appointmentId },
      { headers: { aToken } }
    );

    if (data.success) {
      toast.success(data.message);

      // Send email notification using EmailJS
      const templateParams = {
        user_name: userName,
        doctor_name: doctorName,
        slot_date: slotDate,
        slot_time: slotTime,
        user_email: userEmail,
      };

      emailjs
        .send(
          
          'service_8bi86gi',        // Replace with your EmailJS service ID
          'template_8sae4aa',       // Replace with your EmailJS template ID
          templateParams,
          'JXZvBf3QUayAh5rgj'         // Replace with your EmailJS user/public key
        )
        .then((response) => {
          toast.success('Cancellation email sent successfully!');
        })
        .catch((error) => {
          console.error('Failed to send email:', error);
          toast.error('Failed to send cancellation email.');
        });

      // Optionally refresh the list of appointments
      getAllAppointments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message);
  }
};


      const getDashData = async()=>{
        try {
          const {data} = await axios.get(backendUrl + '/api/admin/dashboard', {headers:{aToken}})
          if(data.success){
            setDashData(data.dashData)
            console.log(data.dashData)
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
      const value = {
          aToken, setAToken,
          backendUrl,doctors,
          getAllDoctors, changeAvailability,
          appointments, setAppointments, 
          getAllAppointments,
          cancelAppointment,
          dashData, getDashData
      }
      
      return (
        <AdminContext.Provider value={value}> 
            {props.children}
        </AdminContext.Provider>
      )
}

export default AdminContextProvider
