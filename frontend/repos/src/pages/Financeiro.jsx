import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Toaster, toast } from 'react-hot-toast';
import {
  XAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

const Financeiro = () => {
  const now = new Date();
  const getMonthName = (date) =>
    date.toLocaleString("pt-BR", { month: "short" }).toUpperCase();

  const month0 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const month1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const month2 = new Date(now.getFullYear(), now.getMonth(), 1);

  // --- DUMMY DATA (ESTADOS INICIAIS) ---
  const [meio_pagamento, setMeioPagamento] = useState([
    { id: 1, tipo: "PIX" },
    { id: 2, tipo: "Cartão de Crédito" },
    { id: 3, tipo: "Dinheiro" }
  ]);

  const [contas_financeiras, setContasFinanceiras] = useState([
    { id: 1, nome: "Caixa Barba & Arte", saldo_atual: 1550.50 },
    { id: 2, nome: "Conta PJ - Nubank", saldo_atual: 4200.00 }
  ]);

  const [tipo_lancamento, setTipoLancamento] = useState([
    { id: 1, desc: "RECEITA" },
    { id: 2, desc: "DESPESA" },
    { id: 3, desc: "DESPESA FIXA" }
  ]);

  const [lancamento, setLancamento] = useState([
    { id: 1, descricao: "Corte + Barba (Cliente VIP)", valor: 85.00, tipo_lancamento_id: 1, data_lancamento: "25/04/2026" },
    { id: 2, descricao: "Pomada Efeito Matte", valor: 45.00, tipo_lancamento_id: 1, data_lancamento: "24/04/2026" },
    { id: 3, descricao: "Aluguel Salão", valor: 1200.00, tipo_lancamento_id: 3, data_lancamento: "05/04/2026" },
    { id: 4, descricao: "Conta de Luz", valor: 280.00, tipo_lancamento_id: 2, data_lancamento: "10/04/2026" },
    { id: 5, descricao: "Reposição de Shampoos", valor: 350.00, tipo_lancamento_id: 2, data_lancamento: "15/04/2026" },
  ]);

  // Estados do Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [meio_pagamento_id, setMeioPagamentoId] = useState('');
  const [conta_financeira_id, setContaFinanceiraId] = useState('');
  const [tipo_lancamento_id, setTipoLancamentoId] = useState('');

  // --- EFEITOS (Tenta buscar do back, se falhar mantém os dummies) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMeios, resContas, resTipos, resLanc] = await Promise.all([
          axios.get('http://localhost:3000/meios_pagamento'),
          axios.get('http://localhost:3000/contas_financeiras'),
          axios.get('http://localhost:3000/tipo_lancamento'),
          axios.get('http://localhost:3000/lancamentos')
        ]);
        setMeioPagamento(resMeios.data);
        setContasFinanceiras(resContas.data);
        setTipoLancamento(resTipos.data);
        setLancamento(resLanc.data);
      } catch (error) {
        console.warn("Backend offline, usando dados fictícios para demonstração.");
      }
    };
    fetchData();
  }, []);

  const salvarLancamentos = () => {
    if(!descricao || !valor || !tipo_lancamento_id) {
        return toast.error("Preencha os campos obrigatórios!");
    }

    const novoLancamento = {
      id: Math.random(),
      descricao,
      valor: parseFloat(valor.replace(',', '.')),
      tipo_lancamento_id: parseInt(tipo_lancamento_id),
      data_lancamento: new Date().toLocaleDateString('pt-BR'),
      meio_pagamento_id,
      conta_financeira_id
    };

    // Simulação de salvamento local para teste imediato EU AAAAAMO
    setLancamento([novoLancamento, ...lancamento]);
    toast.success("Lançamento salvo com sucesso!");
    setIsModalOpen(false);
    limparCampos();
  };

  const limparCampos = () => {
    setDescricao("");
    setValor("");
    setTipoLancamentoId("");
    setMeioPagamentoId("");
    setContaFinanceiraId("");
  };

  // --- CÁLCULOS DO DASHBOARD ---
  const receitasTotais = lancamento
    .filter(l => l.tipo_lancamento_id === 1)
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const despesasTotais = lancamento
    .filter(l => l.tipo_lancamento_id === 2 || l.tipo_lancamento_id === 3)
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const graficoReceitas = [
    { name: getMonthName(month0), valor: receitasTotais * 0.7 },
    { name: getMonthName(month1), valor: receitasTotais * 0.9 },
    { name: getMonthName(month2), valor: receitasTotais },
  ];

  const graficoDespesas = [
    { name: getMonthName(month0), valor: despesasTotais * 0.8 },
    { name: getMonthName(month1), valor: despesasTotais * 1.1 },
    { name: getMonthName(month2), valor: despesasTotais },
  ];

  return (
    <main className='w-screen flex h-screen overflow-x-hidden bg-transparent'>
      <Navbar />
      <Toaster position="top-center" />
      
      <section className='p-6 w-full h-full flex flex-col'>
        <header className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='font-bold text-3xl text-gray-800 tracking-tight'>Financeiro</h2>
            <p className='text-gray-500 text-sm'>Gestão de fluxo de caixa e saldos</p>
          </div>
          <div className='flex gap-3 text-xs'>
            <button className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-amber-50 hover:bg-gray-100 transition-all shadow-sm'>
              <i className="bi bi-file-earmark-pdf"></i> Relatório PDF
            </button>
            <button 
              className='flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-md'
              onClick={() => setIsModalOpen(true)}
            >
              <i className="bi bi-plus-lg"></i> Novo Lançamento
            </button>
          </div>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4'>
          {/* SALDO DAS CONTAS */}
          <div className="bg-amber-50 p-5 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
            <h3 className="font-bold mb-4 text-gray-700 flex items-center gap-2">
              <i className="bi bi-wallet2 text-amber-600"></i> Meus Saldos
            </h3>
            <div className='space-y-3'>
              {contas_financeiras.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-3 mb-2 bg-amber-100 rounded-xl shadow-sm">
                  <span className='text-gray-600 font-medium text-sm'>{c.nome}</span>
                  <span className="font-bold text-amber-900 text-sm">R$ {Number(c.saldo_atual).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DASHBOARDS - GRÁFICOS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className='font-bold text-xs text-green-600 mb-4 uppercase tracking-wider'>Receitas</h4>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graficoReceitas}>
                    <XAxis dataKey="name" hide />
                    <RechartsTooltip cursor={{fill: '#f0fdf4'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="valor" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className='font-bold text-xs text-red-600 mb-4 uppercase tracking-wider'>Despesas</h4>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graficoDespesas}>
                    <XAxis dataKey="name" hide />
                    <RechartsTooltip cursor={{fill: '#fef2f2'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="valor" fill="#ef4444" opacity={0.9} radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA DE LANÇAMENTOS */}
        <section className='bg-amber-50 p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col max-h-[300px]'>
          <div className='flex justify-between items-center mb-6'>
            <h3 className="font-bold text-xl text-gray-800">Histórico Recente</h3>
            <div className="relative">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" placeholder="Filtrar lançamentos..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className='flex-1 overflow-y-auto pr-2 space-y-3'>
            {lancamento.map((item, index) => {
              const isReceita = item.tipo_lancamento_id === 1;
              return (
                <div key={index} className="group p-4 bg-amber-50 border border-gray-100 rounded-xl flex justify-between items-center hover:border-amber-200 hover:shadow-md transition-all">
                  <div className='flex items-center gap-4'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isReceita ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <i className={`bi ${isReceita ? 'bi-arrow-up-short' : 'bi-arrow-down-short'} text-2xl`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 uppercase">{item.descricao}</p>
                      <p className="text-xs text-gray-400 font-medium">{item.data_lancamento} • {tipo_lancamento.find(t => t.id === item.tipo_lancamento_id)?.desc}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className={`text-sm font-black ${isReceita ? 'text-green-600' : 'text-red-600'}`}>
                      {isReceita ? '+' : '-'} R$ {Number(item.valor).toFixed(2)}
                    </p>
                    <button className='opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 underline transition-opacity'>Ver detalhes</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      {/* MODAL DE LANÇAMENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-amber-50 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className='p-6 border-b border-gray-100 flex justify-between items-center bg-amber-50/50'>
              <h2 className='font-black text-gray-800 uppercase tracking-tighter'>Novo Lançamento</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-50 transition-colors">
                <i className="bi bi-x-lg text-gray-500"></i>
              </button>
            </div>

            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-[10px] font-black text-gray-400 mb-1 uppercase'>Descrição do Gasto/Ganho</label>
                <input
                  type="text"
                  placeholder="Ex: Pagamento Fornecedor"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-amber-50 rounded-xl p-3 text-sm outline-none transition-all"
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-[10px] font-black text-gray-400 mb-1 uppercase'>Valor (R$)</label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-amber-50 rounded-xl p-3 text-sm font-bold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className='block text-[10px] font-black text-gray-400 mb-1 uppercase'>Categoria</label>
                  <select
                    value={tipo_lancamento_id}
                    onChange={e => setTipoLancamentoId(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-amber-50 rounded-xl p-3 text-sm outline-none transition-all"
                  >
                    <option value="">Selecione</option>
                    {tipo_lancamento.map((t) => <option key={t.id} value={t.id}>{t.desc}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-[10px] font-black text-gray-400 mb-1 uppercase'>Conta de Destino/Origem</label>
                <select
                  value={conta_financeira_id}
                  onChange={e => setContaFinanceiraId(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-amber-50 rounded-xl p-3 text-sm outline-none transition-all"
                >
                  <option value="">Selecione a conta</option>
                  {contas_financeiras.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              <button
                onClick={salvarLancamentos}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98] mt-2"
              >
                Confirmar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Financeiro;