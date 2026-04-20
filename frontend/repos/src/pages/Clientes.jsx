import React from 'react'
import { useState } from 'react';
import { Toaster } from 'react-hot-toast'
import Navbar from '../../components/Navbar';
import { use } from 'react';

const Clientes = () => {

  // DUMMY DATA
  const dummyClientes = [
    { id: 1, nome: "Fulano de Tal", aniversario: "20/05", status_fidelidade: "VIP", ticketmedio: 60.00, ultimoservico: "Corte de Cabelo", dataultimoservico: "10/09", observacoes: "Cliente frequente, gosta de cortes modernos.", precaucoes: "Alergia a produtos com amônia." },
    { id: 2, nome: "Jojo Todynho", aniversario: "15/08", status_fidelidade: "CLIENTE NOVO", ticketmedio: 35.00, ultimoservico: "Pintura de Unhas", dataultimoservico: "05/09", observacoes: "Cliente novo, interessado em tratamentos de beleza.", precaucoes: "Alergia a produtos com amônia." },
  ];

  // MODAL CLIENTES
  const [isModalClientes, setisModalClientes] = useState(false);

  // CLIENTE SELECIONADO
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // ESTILOS
  const statusStyles = {
  "FIDELIDADE ATIVA": "bg-green-100 text-green-700 border-green-200",
  "FIDELIDADE INATIVA": "bg-red-100 text-red-700 border-red-200",
  "PLANO ATIVO": "bg-blue-100 text-blue-700 border-blue-200",
  "PLANO INATIVO": "bg-gray-100 text-gray-500 border-gray-200",
  "CLIENTE NOVO": "bg-amber-100 text-amber-700 border-amber-200",
  "DESATIVADO": "bg-black text-white border-black",
  "VIP": "bg-purple-100 text-purple-700 border-purple-200 shadow-sm font-black",
  "EM RISCO": "bg-orange-100 text-orange-700 animate-pulse", // Um toque de animação para atenção!
};

  return (
    <main className="w-screen flex h-screen overflow-x-hidden">
      <Toaster />
      <Navbar />

      {/* CONTEÚDO */}
      <div className='p-6 w-screen h-full overflow-y-auto'>
          <div className='flex justify-between mb-3'>
            <h1 className='font-bold text-2xl text-gray-900' >Clientes</h1>
            <button className='flex gap-2 p-2 font-bold text-xl items-center rounded-md align-middle bg-amber-600 text-gray-50 hover:bg-amber-700 shadow-md'>
              <i className="bi bi-plus-circle text-xs"></i>
              <span className='text-sm'>Adicionar Cliente</span>
            </button>
          </div>

          {/* DASH DE CLIENTES */}
          <div className='flex justify-between gap-4 font-semibold text-amber-50'>
            <div className='flex gap-4 bg-amber-700 p-3 text-xs rounded-md items-center shadow-md'>
                <i class="bi bi-people text-xl"></i>
                <div>
                  <p className='font-semibold'>Total de Clientes</p>
                  <p className='text-xs'>10</p>
                </div>
            </div>

            <div className='flex gap-4 bg-amber-800 p-3 text-xs rounded-md items-center shadow-md'>
                <i className="bi bi-person-add text-xl"></i>
                <div>
                  <p className='font-semibold'>Clientes Novos no Mês</p>
                  <p className='text-xs'>10</p>
                </div>
            </div>

            <div className='flex gap-4 bg-amber-900 p-3 text-xs rounded-md items-center shadow-md'>
                <i class="bi bi-cake2 text-xl"></i>
                <div>
                  <p className='font-semibold'>Aniversariantes do Dia</p>
                  <p className='text-xs'>9</p>
                </div>
            </div>

            <div className='flex gap-4 bg-amber-950 p-3 text-xs rounded-md items-center shadow-md'>
                <i class="bi bi-bag-heart text-xl"></i>
                <div>
                  <p className='font-semibold'>Serviço Mais Contratado</p>
                  <p className='text-xs'>10</p>
                </div>
            </div>
          </div>

          {/* LISTA DE CLIENTES */}
          <div className='flex justify-between align-middle mt-6'>
            <h2 className="text-gray-500 font-semibold mb-2 uppercase mt-4">Listagem de Clientes</h2>
            <div className="flex gap-2 items-center">
              <input 
                type="text" placeholder=" Pesquisar..." 
                className="w-64 border p-2 rounded-md text-sm outline-none shadow-sm focus:border-amber-600"
              />
              <button className="p-1 w-8 h-8 items-center font-bold bg-amber-600 rounded-md text-white hover:bg-amber-700 transition-all">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {dummyClientes.length > 0 ? (
              dummyClientes.map(c => (
                <button onClick={() => {
                  setClienteSelecionado(c);
                  setisModalClientes(true);
                }}>
                    <div key={c.id} className="p-4 flex justify-between items-center bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      {/* Avatar gerado por iniciais */}
                      <div className="w-10 h-10 bg-amber-100 text-amber-700 flex items-center justify-center rounded-full font-bold">
                        {c.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 leading-none">{c.nome}</p>
                        <p className="text-xs text-gray-400 mt-1">{c.descricao}</p>
                      </div>
                    </div>
                    
                    <div className="text-right flex gap-6 items-center">
                      <div className='hidden md:block'>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Último Gasto</p>
                      </div>
                      <div className='flex gap-2'>
                        <button className="hover:scale-110 transition-transform">
                          <i className="bi bi-pencil-square text-xl text-amber-600"></i>
                        </button>
                        <button className="hover:scale-110 transition-transform">
                          <i className="bi bi-whatsapp text-xl text-green-500"></i>
                        </button>
                      </div>
                    </div>
                </div>
                </button>
              ))
            ) : (
              <p className="text-gray-400 italic">Nenhum cliente encontrado.</p>
            )}
          </div>
      </div>

      {/* --- MODAIS --- */}
      {isModalClientes && (
        <div className="fixed inset-0 text-center bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          {/* HEADER */}
          <div className='w-1/2 rounded-md shadow-lg bg-amber-50 justify-between p-6 border-b text-start'>
           <div className='flex justify-between mb-4'>
             <h2 className='font-bold text-gray-800 text-lg'>Dados do Cliente</h2>
              <button onClick={() => {
                setisModalClientes(false);
                setClienteSelecionado(null);
              }} className="text-gray-400 hover:text-red-500"><i className="bi bi-x-lg"></i></button>
           </div>

            {/* CONTEÚDO DO MODAL */}
            <div className='p-6 space-y-4'>
              {/* HEADER DO CLIENTE */}
              <div className='flex justify-between gap-8 w-full'>
                <div className="w-16 h-16 shrink-0 bg-amber-200 text-amber-800 flex items-center justify-center rounded-full font-bold text-3xl shadow-md">
                  {clienteSelecionado.nome.charAt(0)}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 w-full'>  
                  <div className="flex flex-col justify-center">
                    <p className='text-[10px] text-amber-600 uppercase font-black tracking-widest mb-1'>Nome Completo</p>
                    <p className='text-lg font-bold text-gray-900 leading-tight'>
                      {clienteSelecionado.nome}
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className='text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1'>Observações / Perfil</p>
                    <p className='text-sm text-gray-600 italic leading-snug'>
                      {clienteSelecionado.observacoes || "Nenhuma observação registrada."}
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 border-t pt-4'>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>ANIVERSÁRIO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.aniversario || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>STATUS</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[clienteSelecionado.status_fidelidade] || "bg-gray-100 text-gray-800"}`}>
                    {clienteSelecionado.status_fidelidade}
                  </span>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>TICKET MÉDIO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      R$ {clienteSelecionado.ticketmedio || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>ÚLTIMO SERVIÇO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.ultimoservico || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>DATA DO ÚLTIMO SERVIÇO</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.dataultimoservico || "Nenhuma observação registrada."}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase font-bold'>PRECAUÇÕES</p>
                  <p className='text-base text-gray-800 font-bold leading-snug'>
                      {clienteSelecionado.precaucoes || "Nenhuma observação registrada."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      )}
    </main>
    
  )
}

export default Clientes