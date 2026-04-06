import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from "react-input-mask";
import axios from 'axios';

import React from 'react'

const AddColaborador = () => {

  return (
    <main className="w-screen flex h-screen overflow-x-hidden">
        <Navbar />
    </main>
  )
}

export default AddColaborador