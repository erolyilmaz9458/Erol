
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  Wallet,
  AlertCircle,
  Clock,
  CheckCircle2,
  Trash2,
  LockKeyhole
} from 'lucide-react';

// --- TİPLER ---
interface Income { id: string; source: string; amount: number; date: string; }
interface Expense { id: string; category: string; amount: number; date: string; }
interface CCard { 
  id: string; 
  name: string; 
  limit: number; 
  balance: number; 
  minPayment: number; 
  statementBalance: number; 
  dueDate: string; 
}
interface SPayment { id: string; desc: string; amount: number; date: string; status: 'Pending' | 'Paid'; }

type AuthStep = 'LOGIN' | 'DASHBOARD';

const BudgetApp = () => {
  const [authStep, setAuthStep] = useState<AuthStep>('LOGIN');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Veri State'leri
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cards, setCards] = useState<CCard[]>([]);
  const [scheduled, setScheduled] = useState<SPayment[]>([]);

  // Modallar
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // --- AUTH AKSİYONLARI ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Kullanıcının istediği sabit şifre: 123456
    setTimeout(() => {
      if (passwordInput === '123456') {
        setAuthStep('DASHBOARD');
      } else {
        alert('Hatalı giriş şifresi! Lütfen tekrar deneyin.');
        setPasswordInput('');
      }
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setAuthStep('LOGIN');
    setPasswordInput('');
  };

  // Dashboard Hesaplamaları
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const ccTotalDebt = cards.reduce((sum, item) => sum + item.balance, 0);
  const netBalance = totalIncome - totalExpense - ccTotalDebt;

  // --- RENDER MANTIĞI ---

  if (authStep === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-slate-950" />
        <div className="relative z-10 glass-panel p-10 max-w-md w-full text-center space-y-8 animate-fade-in shadow-2xl">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <Wallet size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tighter">YILMAZ AİLESİ BÜTÇE</h1>
            <p className="text-white/40 text-sm">Giriş yapmak için aile şifresini girin.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input 
                type="password" 
                placeholder="Giriş Şifresi" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="auth-input pl-12"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="auth-button bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                "Sisteme Giriş Yap"
              )}
            </button>
          </form>
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Güvenli Aile Erişimi Etkin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* Arka Plan */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('bg_budget.jpg'), linear-gradient(to bottom right, #0f172a, #1e3a8a)" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      {/* Navigasyon */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Wallet className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">YILMAZ AİLESİ BÜTÇE</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-bold text-white">Yılmaz Ailesi</span>
            <span className="text-[10px] text-white/40">Aktif Oturum</span>
          </div>
          <button onClick={handleLogout} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/80 group" title="Güvenli Çıkış">
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title="Aylık Gelir" amount={totalIncome} icon={<TrendingUp className="text-emerald-400" />} color="emerald" />
          <SummaryCard title="Aylık Gider" amount={totalExpense} icon={<TrendingDown className="text-rose-400" />} color="rose" />
          <SummaryCard title="Kart Borçları" amount={ccTotalDebt} icon={<CreditCard className="text-amber-400" />} color="amber" />
          <SummaryCard title="Net Bakiye" amount={netBalance} icon={<ShieldCheck className="text-blue-400" />} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-panel p-6">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="text-blue-400" size={20} /> Kredi Kartı Takvimi
                </h2>
                <button onClick={() => setShowCardForm(true)} className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                  <Plus size={16} /> Kart Kaydı
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-white/30 uppercase tracking-[0.1em] border-b border-white/5">
                      <th className="pb-4 font-bold">Kart Adı</th>
                      <th className="pb-4 font-bold text-right">Asgari</th>
                      <th className="pb-4 font-bold text-right">Dönem Borcu</th>
                      <th className="pb-4 font-bold text-right">Borç</th>
                      <th className="pb-4 font-bold text-center">Ödeme</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {cards.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-white/20 italic">Veri girilmemiş.</td></tr>
                    ) : cards.map(card => (
                      <tr key={card.id} className="text-sm hover:bg-white/[0.02] transition-colors">
                        <td className="py-5 font-semibold text-white/80">{card.name}</td>
                        <td className="py-5 text-right text-amber-500 font-mono">₺{card.minPayment.toLocaleString('tr-TR')}</td>
                        <td className="py-5 text-right text-rose-400 font-mono">₺{card.statementBalance.toLocaleString('tr-TR')}</td>
                        <td className="py-5 text-right font-mono">₺{card.balance.toLocaleString('tr-TR')}</td>
                        <td className="py-5 text-center">
                          <span className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] font-bold text-white/50">{card.dueDate}. Gün</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="glass-panel p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <Calendar className="text-purple-400" size={20} /> Ödeme Planı
              </h2>
              <div className="space-y-4">
                {scheduled.length === 0 ? (
                  <div className="py-10 text-center text-white/20 italic">Ödeme planı boş.</div>
                ) : (
                  scheduled.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${item.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {item.status === 'Paid' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-white/90">{item.desc}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">{item.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg font-mono text-white">₺{item.amount.toLocaleString('tr-TR')}</p>
                        <button className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-widest mt-1">Durumu Değiştir</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sağ Kolon */}
          <div className="space-y-8">
            <section className="glass-panel p-6">
              <h2 className="text-lg font-semibold mb-6">Hızlı Veri Girişi</h2>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowIncomeForm(true)} className="quick-action bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-emerald-400">
                  <TrendingUp size={24} /> <span className="text-xs font-bold uppercase tracking-wider">Gelir</span>
                </button>
                <button onClick={() => setShowExpenseForm(true)} className="quick-action bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40 text-rose-400">
                  <TrendingDown size={24} /> <span className="text-xs font-bold uppercase tracking-wider">Gider</span>
                </button>
              </div>
            </section>

            <section className="glass-panel p-6">
              <h2 className="text-lg font-semibold mb-6">Finansal Sağlık</h2>
              <div className="space-y-6">
                <HealthIndicator label="Tasarruf Oranı" percentage={Math.max(0, Math.min(100, (netBalance / (totalIncome || 1)) * 100))} color="blue" />
                <HealthIndicator label="Borç Yükü" percentage={Math.min(100, (ccTotalDebt / (totalIncome || 1)) * 100)} color="rose" />
                
                <div className="mt-8 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20 flex gap-4">
                  <AlertCircle className="text-blue-400 shrink-0" size={20} />
                  <p className="text-xs text-blue-100/60 leading-relaxed font-medium">
                    Kredi kartı borçlarınızı son ödeme gününden önce ödeyerek faiz yükünü minimize edebilirsiniz.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Form Modalları */}
      {showCardForm && (
        <FormModal title="Kart Kaydı" onClose={() => setShowCardForm(false)}>
          <CardForm onSave={(newCard: any) => { setCards([...cards, { ...newCard, id: Date.now().toString() }]); setShowCardForm(false); }} />
        </FormModal>
      )}
      {showIncomeForm && (
        <FormModal title="Gelir Ekle" onClose={() => setShowIncomeForm(false)}>
           <QuickForm type="income" onSave={(v: any) => { setIncomes([...incomes, {...v, id: Date.now().toString()}]); setShowIncomeForm(false); }} />
        </FormModal>
      )}
      {showExpenseForm && (
        <FormModal title="Gider Ekle" onClose={() => setShowExpenseForm(false)}>
           <QuickForm type="expense" onSave={(v: any) => { setExpenses([...expenses, {...v, id: Date.now().toString()}]); setShowExpenseForm(false); }} />
        </FormModal>
      )}

      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }
        .quick-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          border-width: 1px;
          border-radius: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          gap: 0.75rem;
        }
        .auth-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.25rem;
          padding: 1.15rem;
          text-align: center;
          font-size: 1.1rem;
          outline: none;
          color: white;
          transition: all 0.2s;
        }
        .auth-input:focus {
          border-color: rgba(59, 130, 246, 0.5);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .auth-button {
          width: 100%;
          padding: 1.15rem;
          border-radius: 1.25rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }
        .auth-button:active {
          transform: scale(0.98);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 0.85rem;
          font-size: 14px;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

// --- ALT BİLEŞENLER ---

const SummaryCard = ({ title, amount, icon, color }: any) => (
  <div className="glass-panel p-5 flex items-center justify-between group hover:scale-[1.02] transition-transform duration-300">
    <div className="space-y-1">
      <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.15em]">{title}</p>
      <p className="text-2xl font-black font-mono">₺{amount.toLocaleString('tr-TR')}</p>
    </div>
    <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/10`}>
      {icon}
    </div>
  </div>
);

const HealthIndicator = ({ label, percentage, color }: any) => (
  <div className="space-y-2.5">
    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
      <span className="text-white/40">{label}</span>
      <span className="text-white">% {Math.round(percentage)}</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full bg-${color}-500 transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

const FormModal = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
    <div className="glass-panel p-8 w-full max-w-md shadow-2xl border border-white/10 relative">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <h3 className="text-xl font-bold tracking-tight uppercase">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <Plus className="rotate-45 text-white/40" size={24} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const CardForm = ({ onSave }: any) => {
  const [data, setData] = useState({ name: '', limit: 0, balance: 0, minPayment: 0, statementBalance: 0, dueDate: '' });
  return (
    <div className="space-y-4">
      <input type="text" className="form-input" placeholder="Kart Adı (Örn: Bonus Platinum)" onChange={e => setData({...data, name: e.target.value})} />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" className="form-input" placeholder="Limit" onChange={e => setData({...data, limit: Number(e.target.value)})} />
        <input type="number" className="form-input" placeholder="Güncel Borç" onChange={e => setData({...data, balance: Number(e.target.value)})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input type="number" className="form-input" placeholder="Asgari Ödeme" onChange={e => setData({...data, minPayment: Number(e.target.value)})} />
        <input type="number" className="form-input" placeholder="Dönem Borcu" onChange={e => setData({...data, statementBalance: Number(e.target.value)})} />
      </div>
      <input type="text" className="form-input" placeholder="Ödeme Günü (1-31 arası)" onChange={e => setData({...data, dueDate: e.target.value})} />
      <button onClick={() => onSave(data)} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs mt-4 transition-all">Sisteme Kaydet</button>
    </div>
  );
};

const QuickForm = ({ type, onSave }: any) => {
  const [data, setData] = useState({ source: '', amount: 0, category: '' });
  const isIncome = type === 'income';
  return (
    <div className="space-y-4">
      <input type="text" className="form-input" placeholder={isIncome ? 'Kaynak (Örn: Maaş)' : 'Kategori (Örn: Market)'} onChange={e => setData({...data, [isIncome ? 'source' : 'category']: e.target.value})} />
      <input type="number" className="form-input" placeholder="Miktar (₺)" onChange={e => setData({...data, amount: Number(e.target.value)})} />
      <button onClick={() => onSave(data)} className={`w-full py-4 ${isIncome ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'} rounded-2xl font-black uppercase tracking-widest text-xs mt-4 transition-all`}>Veriyi İşle</button>
    </div>
  );
};

const AuthLayout = ({ icon, title, subtitle, children }: any) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 relative">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-950" />
    <div className="glass-panel p-10 max-w-sm w-full text-center space-y-6 animate-fade-in relative z-10 border border-white/10 shadow-2xl">
      <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight uppercase">{title}</h2>
        <p className="text-white/40 text-xs mt-2 leading-relaxed">{subtitle}</p>
      </div>
      {children}
    </div>
  </div>
);

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<BudgetApp />);
}
