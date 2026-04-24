import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import toast, { Toaster } from 'react-hot-toast';
import InputMask from "react-input-mask";
import axios from 'axios';

const Agendamentos = () => {
  // const [eventos, setEventos] = useState([]);
  const [eventos, setEventos] = useState([
    {
      id: 'dummy-1',
      title: 'Ana Silva (Corte e Escova)',
      start: '2026-04-24T09:00:00',
      extendedProps: {
        observacao: 'Corte e Escova',
        colaborador: 'Marcos Oliveira',
        cliente: 'Ana Silva',
        telefone: '(71) 98888-7777'
      }
    },
    {
      id: 'dummy-2',
      title: 'Bruno Souza (Barba e Hidratação)',
      start: '2026-04-24T10:30:00',
      extendedProps: {
        observacao: 'Barba e Hidratação',
        colaborador: 'Ricardo Santos',
        cliente: 'Bruno Souza',
        telefone: '(71) 97777-6666'
      }
    },
    {
      id: 'dummy-3',
      title: 'Carla Dias (Coloração)',
      start: '2026-04-24T14:00:00',
      extendedProps: {
        observacao: 'Coloração',
        colaborador: 'Marcos Oliveira',
        cliente: 'Carla Dias',
        telefone: '(71) 96666-5555'
      }
    },
    {
      id: 'dummy-4',
      title: 'Daniel Santos',
      start: '2026-04-25T08:00:00',
      extendedProps: {
        observacao: 'Barba e Hidratação',
        colaborador: 'Marcos Oliveira',
        cliente: 'Daniel Santos',
        telefone: '(71) 95555-4444'
      }
    }
  ]);
  const [servicos, setServicos] = useState([]);
  const [colaboradores, setColaborador] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Estados dos Modais e Formulários
  const [modalAberto, setModalAberto] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Estados dos Inputs
  const [cliente_id, setClienteId] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [servico_id, setServicoId] = useState('');
  const [colaboradores_id, setColaboradoresId] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  const [documento, setDocumento] = useState('');
  const [nomeRazao, setNomeRazao] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    // Carregar Serviços
    axios.get('http://localhost:3000/servicos')
      .then(res => setServicos(res.data))
      .catch(() => toast.error("Erro ao carregar serviços"));

    // Carregar Colaboradores
    axios.get('http://localhost:3000/colaboradores')
      .then(res => setColaborador(res.data))
      .catch(() => toast.error("Erro ao carregar colaboradores"));

    // Carregar Detalhes dos Agendamentos
    axios.get('http://localhost:3000/agendamentos/detalhes')
      .then((response) => {
        const eventosBD = response.data.map((ag) => ({
          id: ag.id,
          title: ag.cliente_nome || "Sem nome",
          start: `${ag.data}T${ag.hora}`,
          extendedProps: {
            observacao: ag.servico_nome || '',
            colaborador: ag.colaborador_nome || '',
            cliente: ag.cliente_nome || '',
            telefone: ag.telefone || ''
          }
        }));
        setEventos(eventosBD);
      })
      .catch(() => toast.error("Erro ao carregar agendamentos!"));
  }, []);

  const salvarAgendamento = () => {
    if (!cliente_id || !data || !hora) return toast.error("Preencha os campos obrigatórios!");

    axios.post('http://localhost:3000/agendamentos', {
      cliente_id,
      observacoes,
      servico_id,
      colaboradores_id,
      data,
      hora
    })
      .then(() => {
        toast.success('Agendamento salvo!');
        setModalAberto(false);
      })
      .catch(() => toast.error('Erro ao salvar agendamento'));
  };

  const salvarCliente = () => {
    axios.post('http://localhost:3000/cliente', {
      documento,
      nome_razao: nomeRazao,
      email,
      telefone
    })
      .then(() => {
        toast.success('Cliente salvo!');
        setModalCliente(false);
      })
      .catch(() => toast.error('Erro ao salvar cliente'));
  };

  // const handleDateClick = (info) => {
  //   const evento = eventos.find((e) => e.start.startsWith(info.dateStr));
  //   if (evento) {
  //     setEventoSelecionado(evento.extendedProps ? evento : { ...evento, extendedProps: evento });
  //   } else {
  //     toast('Nenhum agendamento nesta data!', { icon: '📅' });
  //   }
  // };

// 1. Função para clique na DATA (Calendário Mensal)
  const handleDateClick = (info) => {
    const eventoEncontrado = eventos.find((e) => e.start.startsWith(info.dateStr));
    if (eventoEncontrado) {
      // Normalizamos os dados para que o modal entenda tanto dummy quanto BD
      setEventoSelecionado({
        title: eventoEncontrado.title,
        start: eventoEncontrado.start,
        ...(eventoEncontrado.extendedProps || eventoEncontrado)
      });
    } else {
      toast('Nenhum agendamento nesta data!', { icon: '📅' });
    }
  };

// 2. Função para clique no EVENTO (Lista ou Calendário)
  const handleEventClick = (info) => {
    setEventoSelecionado({
      title: info.event.title,
      start: info.event.startStr || info.event.start,
      ...info.event.extendedProps, 
    });
  };

  return (
    <main className='flex w-screen h-screen overflow-hidden'>
      <Navbar />
      <Toaster position="top-center" />

      <div className="p-6 flex-1 overflow-y-auto bg-transparent">
        <div className='flex justify-between items-center mb-6'>
          <h2 className='font-bold text-2xl text-gray-800'>Agendamentos</h2>
          <div className='flex gap-2'>
            <button className='p-2 rounded-md border border-gray-700 hover:bg-gray-700 hover:text-gray-50'>
              <i className="bi bi-clipboard2-data"></i>
              Relatório
            </button>
            <button onClick={() => setModalAberto(true)} className='bg-amber-600 font-semibold text-white px-4 py-2 rounded-md hover:bg-amber-700 flex items-center gap-2 text-sm transition-all'>
              <i className="bi bi-calendar-plus"></i> Novo Agendamento
            </button>
          </div>
        </div>

        {/* Calendário Mensal */}
        <div className='flex flex-1 gap-2 overflow-hidden bg-transparent'>
          {/* COLUNA ESQUERDA: Agenda Estilo Tabela (Ocupa 70%) */}
          <div className='flex-[3] bg-amber-50 rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden'>
            <div className="p-2 border-b bg-transparent flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase">Agenda do Dia</span>
              <button className='flex gap-2 p-2 text-sm font-semibold text-amber-50 rounded-md bg-amber-800 hover:bg-amber-900'>
                <i className="bi bi-calendar-plus"></i> Lista de Espera
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-calendar-compact">
              <FullCalendar
                locale={ptBrLocale}
                plugins={[listPlugin, interactionPlugin]}
                initialView="listDay"
                height="100%"
                events={eventos}
                headerToolbar={false}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                noEventsContent="Vazio"
              />
            </div>
          </div>

          {/* COLUNA DIREITA: Calendário Mensal Mini (Ocupa 30%) */}
          <div className='flex-1 flex flex-col gap-4 max-w-[500px]'>
            {/* Card de Informação Rápida */}
            <div className="bg-amber-50 border p-3 rounded-lg shadow-md">
              <h4 className="text-[10px] font-black text-gray-800 uppercase mb-2">Resumo</h4>
              <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-bold uppercase">Agendamentos hoje </span>
                  <span className="font-bold text-amber-700">{eventos.length}</span>
              </div>
            </div>

            <div className='bg-transparent rounded-lg shadow-sm border border-gray-200 p-2'>
              <style>{`
                .fc .fc-toolbar-title {font-weight: 800 !important; font-size: 0.8rem !important; font-bold !important; text-transform: capitalize; }
                .fc .fc-button { padding: 0.2rem 0.4rem !important; font-size: 0.7rem !important; outline: none !important;}
                .fc-theme-standard th { font-size: 0.6rem !important; padding: 2px !important; }
                .fc-daygrid-day-number { font-size: 0.75rem !important; padding: 2px !important; }
                .fc-daygrid-day-frame {
                  min-height: 25px !important; 
                  height: 20px !important;
                }
                .fc-daygrid-event {
                  font-size: 0.65rem !important;
                  padding: 0px 2px !important;
                  margin-bottom: 1px !important;
                  border-radius: 3px !important;
                }
                .fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events { min-height: 0 !important; }
                .fc-list-event-time { font-weight: bold; color: #b5662a; }
                .fc-list-event-title { font-size: 0.8rem !important; }
              `}</style>
              <FullCalendar
                locale={ptBrLocale}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="auto"
                events={eventos}
                headerToolbar={{
                  left: 'prev',
                  center: 'title',
                  right: 'next'
                }}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                dayMaxEvents={false}
                moreLinkContent={(args) => `+${args.num}`}
              />
            </div>

            
          </div>
        </div>

        {/* Modal Novo Agendamento */}
        {modalAberto && (
          <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm'>
            <div className='bg-white rounded-xl shadow-2xl p-6 w-[450px] animate-in fade-in zoom-in duration-200'>
              <div className='flex justify-between items-center mb-6 border-b pb-2'>
                <h2 className='font-bold text-xl'>Agendar Horário</h2>
                <button onClick={() => setModalAberto(false)}><i className="bi bi-x-lg text-gray-500 hover:text-red-500"></i></button>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>CLIENTE</label>
                  <input type='text' value={cliente_id} onChange={e => setClienteId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder='Ex: 123' />
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <label className='block text-xs font-bold text-gray-600 mb-1'>DATA</label>
                    <input type='date' value={data} onChange={e => setData(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                  </div>
                  <div className='flex-1'>
                    <label className='block text-xs font-bold text-gray-600 mb-1'>HORA</label>
                    <input type='time' value={hora} onChange={e => setHora(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>SERVIÇO</label>
                  <select value={servico_id} onChange={e => setServicoId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none">
                    <option value="">Selecione...</option>
                    {servicos.map(s => <option key={s.id} value={s.id}>{s.descricao}</option>)}
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>COLABORADOR</label>
                  <select value={colaboradores_id} onChange={e => setColaboradoresId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none">
                    <option value="">Selecione...</option>
                    {colaboradores.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>

                <button onClick={salvarAgendamento} className='w-full bg-green-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
                  <i className="bi bi-check2-circle"></i> Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalhes do Agendamento */}
        {eventoSelecionado && (
          <div className='fixed inset-0 bg-black/60 flex justify-center items-center z-[100] backdrop-blur-sm'>
            <div className='bg-white rounded-xl shadow-2xl p-6 w-[400px] border-t-4 border-amber-600 animate-in fade-in zoom-in duration-200'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-black text-lg text-gray-800 uppercase'>Detalhes do Horário</h3>
                <button onClick={() => setEventoSelecionado(null)}>
                  <i className="bi bi-x-lg text-gray-400 hover:text-red-500"></i>
                </button>
              </div>

              <div className='space-y-3'>
                <div className='flex flex-col'>
                  <span className='text-[10px] font-bold text-amber-700 uppercase'>Cliente</span>
                  <p className='text-sm font-semibold text-gray-900'>
                    {eventoSelecionado.cliente || eventoSelecionado.title}
                  </p>
                </div>

                <div className='flex gap-4'>
                  <div className='flex-1'>
                    <span className='text-[10px] font-bold text-amber-700 uppercase'>Data / Hora</span>
                    <p className='text-sm text-gray-700'>
                      {eventoSelecionado.start ? (
                        <>
                          {new Date(eventoSelecionado.start).toLocaleDateString('pt-BR')} às {' '}
                          {new Date(eventoSelecionado.start).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                        </>
                      ) : 'Horário não disponível'}
                    </p>
                  </div>
                </div>

                <div className='flex flex-col border-t pt-2'>
                  <span className='text-[10px] font-bold text-gray-500 uppercase'>Serviço</span>
                  <p className='text-sm text-gray-800'>{eventoSelecionado.observacao || 'Não informado'}</p>
                </div>

                <div className='flex flex-col'>
                  <span className='text-[10px] font-bold text-gray-500 uppercase'>Profissional</span>
                  <p className='text-sm text-gray-800'>{eventoSelecionado.colaborador || 'Não definido'}</p>
                </div>

                {eventoSelecionado.telefone && (
                  <div className='flex flex-col border-t pt-2'>
                    <span className='text-[10px] font-bold text-gray-500 uppercase'>Contato</span>
                    <p className='text-sm text-blue-600 font-medium underline'>{eventoSelecionado.telefone}</p>
                  </div>
                )}
              </div>

              <div className='mt-6 flex gap-2'>
                <button className='flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-100'>
                  CANCELAR
                </button>
                <button onClick={() => setEventoSelecionado(null)} className='flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-200'>
                  FECHAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Agendamentos;