import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
  const location = useLocation();

  // Função para verificar se a rota atual é a do botão
  const isActive = (path) => location.pathname === path;

  return (
    <nav className='w-1/4 h-screen sticky top-0 p-6 border-r border-slate-400 bg-transparent flex flex-col'>
      
      {/* Perfil do Usuário */}
      <div id='perfildeusuário' className='flex gap-4 items-center'>
        <img 
          src='repos/src/imgs/pfp.png' 
          className='w-12 h-12 rounded-full object-cover' 
          alt='Profile'
        />
        <div className='flex-1'>
          <p className='text-1xl font-semibold whitespace-nowrap'>João Pessoa Valensky</p>
          <p className='text-xs font-light'>Administrador</p>
        </div>
        <Link to='/login' className="text-gray-600 hover:text-black">
          <i className="bi bi-box-arrow-right text-lg font-semibold"></i>
        </Link>
      </div>

      {/* Navegação do Sistema */}
      <div className='flex flex-col gap-5 flex-1 mt-6'>
        
        <Link to='/dashboard' className='mb-1 hover:text-black'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/dashboard') ? 'text-black font-bold' : 'text-gray-500'
          }`}>
            <i className="bi bi-columns-gap text-xl"></i>
            <p>Dashboard</p>
          </button>
        </Link>

        <Link to='/agendamentos' className='mb-1'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/agendamentos') ? 'text-black font-bold' : 'text-gray-500 '
          }`}>
            <i className="bi bi-calendar-event text-xl"></i>
            <p>Agendamentos</p>
          </button>
        </Link>

        <Link to='/clientes' className='mb-1'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/clientes') ? 'text-black font-bold' : 'text-gray-500 '
          }`}>
            <i class="bi bi-star-fill"></i>
            <p>Clientes</p>
          </button>
        </Link>

        <Link to='/colaboradores' className='mb-1'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/colaboradores') ? 'text-black font-bold' : 'text-gray-500 '
          }`}>
            <i className="bi bi-person-badge text-xl"></i>
            <p>Colaboradores</p>
          </button>
        </Link>

        <Link to='/confirmacoes' className='mb-1'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/confirmacoes') ? 'text-black font-bold' : 'text-gray-500 '
          }`}>
            <i className="bi bi-check-square text-xl"></i>
            <p>Confirmações</p>
          </button>
        </Link>

        <Link to='/estoque' className='mb-1'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/estoque') ? 'text-black font-bold' : 'text-gray-500 '
          }`}>
            <i className="bi bi-inboxes text-xl"></i>
            <p>Estoque</p>
          </button>
        </Link>

        <Link to='/financeiro' className='mb-1'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/financeiro') ? 'text-black font-bold' : 'text-gray-500 '
          }`}>
            <i className="bi bi-cash text-2xl"></i>
            <p>Financeiro</p>
          </button>
        </Link>

        <Link to='/servicos' className='mb-1'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 text-lg hover:text-black ${
            isActive('/servicos') ? 'text-black font-bold' : 'text-gray-500 '
          }`}>
            <i class="bi bi-person-workspace"></i>
            <p>Serviços</p>
          </button>
        </Link>


      </div>

      {/* Linha Divisória 2 */}
      <hr className='w-full border-slate-400 my-6' />

      {/* Rodapé: Suporte e Logo */}
      <div className='flex flex-col gap-6'>
        
        <Link to='/suporte'>
          <button className={`flex items-center gap-6 w-full transition-colors duration-100 ${
            isActive('/suporte') ? 'text-black font-bold' : 'text-gray-500 hover:text-black'
          }`}>
            <i className="bi bi-question-octagon text-lg"></i>
            <p>Suporte</p>
          </button>
        </Link>

        <div className='flex justify-center pb-2'>
          <img 
            src='repos/src/imgs/GlamSys.svg' 
            className='w-40 h-auto' 
            alt='GlamSys Logo' 
          />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;