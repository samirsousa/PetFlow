import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'initial-1', text: "Olá! Sou o PetBot. Como posso ajudar você com o nosso site hoje?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [appointment, setAppointment] = useState({ petName: '', ownerName: '', service: 'banho', date: '' });
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteDegrees, setRouletteDegrees] = useState(0);
  const [roulettePrize, setRoulettePrize] = useState(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const roulettePrizes = [
    { text: '10% de Desconto', coupon: 'PETVIP10', color: '#1e88e5' },
    { text: 'Petisco Grátis', coupon: 'MIMOPET', color: '#2e7d32' },
    { text: 'Frete Grátis', coupon: 'FRETEGRATIS', color: '#f57c00' },
    { text: 'Hidratação Cortesia', coupon: 'BANHOVIP', color: '#e91e63' }
  ];

  const [calcPetType, setCalcPetType] = useState('cao');
  const [calcSize, setCalcSize] = useState('medio');
  const [calcWeight, setCalcWeight] = useState('');
  const [calcActivity, setCalcActivity] = useState('calmo');
  const [calcResult, setCalcResult] = useState(null);
  const [suggestedProduct, setSuggestedProduct] = useState(null);

  const products = [
    { id: 1, name: 'Ração Premium Cães Adultos (10kg)', price: 189.90, icon: 'RC', desc: 'Nutrição balanceada de alta absorção.' },
    { id: 2, name: 'Ração Especial Gatos Castrados (3kg)', price: 84.50, icon: 'RG', desc: 'Controle de peso e saúde urinária.' },
    { id: 3, name: 'Brinquedo Mordedor de Corda Nó', price: 29.90, icon: 'BM', desc: 'Ajuda na limpeza dos dentes e reduz o estresse.' },
    { id: 4, name: 'Arranhador Torre com Casinha', price: 249.00, icon: 'AT', desc: 'Divertido e ideal para afiar as unhas dos felinos.' },
    { id: 5, name: 'Shampoo Neutro Premium Pet (500ml)', price: 34.90, icon: 'SH', desc: 'Fórmula suave que não irrita os olhos e a pele.' },
    { id: 6, name: 'Petisco Bifinho de Carne para Cães', price: 12.90, icon: 'PB', desc: 'O lanchinho ideal para adestramento e recompensa.' },
    { id: 7, name: 'Caixa de Transporte Confort Viagem', price: 119.00, icon: 'CT', desc: 'Segurança e ventilação para passeios e idas ao veterinário.' },
    { id: 8, name: 'Cama Nuvem Ultra Macia G', price: 159.90, icon: 'CN', desc: 'Conforto térmico e relaxamento profundo para o pet.' },
    { id: 9, name: 'Coleira Peitoral Ergonômica Guia', price: 45.00, icon: 'CP', desc: 'Ajustável e ideal para passeios mais seguros e sem puxões.' },
    { id: 10, name: 'Areia Sanitária Sílica para Gatos (1.8kg)', price: 54.90, icon: 'AS', desc: 'Máxima absorção de odores e alta durabilidade.' }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('petshop_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (currentPage === 'agenda') {
      fetch('http://localhost:3000/events')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCalendarEvents(data);
        })
        .catch(err => console.error("Erro ao buscar agenda do Google:", err));
    }
  }, [currentPage]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body, html { margin: 0; padding: 0; width: 100%; overflow-x: hidden; box-sizing: border-box; }
      * { box-sizing: border-box; transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
      @media (max-width: 768px) {
        nav { flex-direction: column !important; gap: 15px !important; text-align: center !important; padding: 15px 2% !important; }
        .nav-links-container { width: 100% !important; justify-content: center !important; flex-wrap: wrap !important; gap: 10px !important; }
        .hero-title-responsive { font-size: 32px !important; }
        .hero-subtitle-responsive { font-size: 16px !important; }
        .form-responsive { padding: 25px 20px !important; width: 100% !important; }
        .sidebar-responsive { width: 100% !important; right: ${isCartOpen ? '0' : '-100%'} !important; }
        .chat-container-responsive { width: 90vw !important; height: 70vh !important; right: 5vw !important; bottom: 80px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [isCartOpen]);

  useEffect(() => {
    document.body.style.overflow = (isCartOpen || isRouletteOpen) ? 'hidden' : 'unset';
  }, [isCartOpen, isRouletteOpen]);

  useEffect(() => {
    if (isChatOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isChatOpen]);

  useEffect(() => {
    document.documentElement.style.backgroundColor = isDarkMode ? '#121212' : '#ffffff';
  }, [isDarkMode]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (authMode === 'cadastro') {
      if (!authForm.name || !authForm.email || !authForm.password) {
        setAuthError('Preencha todos os campos.');
        return;
      }
      const newUser = { name: authForm.name, email: authForm.email };
      localStorage.setItem(`account_${authForm.email}`, JSON.stringify({ ...newUser, password: authForm.password }));
      localStorage.setItem('petshop_user', JSON.stringify(newUser));
      setUser(newUser);
    } else {
      const savedAccount = localStorage.getItem(`account_${authForm.email}`);
      if (savedAccount) {
        const parsedAccount = JSON.parse(savedAccount);
        if (parsedAccount.password === authForm.password) {
          localStorage.setItem('petshop_user', JSON.stringify(parsedAccount));
          setUser(parsedAccount);
          return;
        }
      }
      setAuthError('Usuário não encontrado ou senha incorreta.');
    }
    setAuthForm({ name: '', email: '', password: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('petshop_user');
    setUser(null);
    setCurrentPage('inicio');
  };

  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setRoulettePrize(null);
    setCopiedNotification(false);
    const prizeIndex = Math.floor(Math.random() * roulettePrizes.length);
    const sliceDegrees = 360 / roulettePrizes.length;
    const targetDegrees = 360 - (prizeIndex * sliceDegrees);
    const totalSpinDegrees = 1800 + targetDegrees;
    setRouletteDegrees(totalSpinDegrees);
    setTimeout(() => {
      const luckyPrize = roulettePrizes[prizeIndex];
      setRoulettePrize(luckyPrize);
      setIsSpinning(false);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(luckyPrize.coupon)
          .then(() => setCopiedNotification(true))
          .catch(err => console.error('Erro ao copiar cupom: ', err));
      }
    }, 3500);
  };

  const closeRouletteModal = () => {
    if (isSpinning) return;
    setIsRouletteOpen(false);
    setRoulettePrize(null);
    setRouletteDegrees(0);
    setCopiedNotification(false);
  };

  const handleCalculateFood = (e) => {
    e.preventDefault();
    const weight = parseFloat(calcWeight);
    if (!weight || weight <= 0) return;
    let factor = calcPetType === 'cao' ? 12 : 15;
    if (calcActivity === 'ativo') factor += 3;
    if (calcSize === 'grande') factor -= 2;
    const dailyGrams = Math.round(weight * factor);
    setCalcResult(dailyGrams);
    setSuggestedProduct(products.find(p => p.id === (calcPetType === 'gato' ? 2 : 1)));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const cleanCode = couponInput.trim().toUpperCase();
    if (cleanCode === 'PETVIP10') {
      setAppliedCoupon({ code: 'PETVIP10', type: 'percentage', value: 10, text: '10% de Desconto' });
      setCouponInput('');
    } else if (cleanCode === 'PRIMEIRAVIZ') {
      setAppliedCoupon({ code: 'PRIMEIRAVIZ', type: 'fixed', value: 20, text: 'R$ 20,00 OFF' });
      setCouponInput('');
    } else if (['MIMOPET', 'FRETEGRATIS', 'BANHOVIP'].includes(cleanCode)) {
      const match = roulettePrizes.find(p => p.coupon === cleanCode);
      setAppliedCoupon({ code: cleanCode, type: 'gift', value: 0, text: match?.text || 'Mimo Especial' });
      setCouponInput('');
    } else {
      setCouponError('Cupom inválido ou expirado.');
    }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponError(''); };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  };

  const clearAndCloseCart = () => { setCartItems([]); setAppliedCoupon(null); setIsCartOpen(false); };

  const cartOriginalTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  let discountAmount = 0;
  if (appliedCoupon && cartOriginalTotal > 0) {
    if (appliedCoupon.type === 'percentage') discountAmount = cartOriginalTotal * (appliedCoupon.value / 100);
    else if (appliedCoupon.type === 'fixed') discountAmount = Math.min(appliedCoupon.value, cartOriginalTotal);
  }
  const cartTotalWithDiscount = cartOriginalTotal - discountAmount;
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutWhatsApp = () => {
    let text = `Olá! Meu nome é ${user.name}. Gostaria de encomendar os seguintes itens:\n\n${cartItems.map(item => `- ${item.name} (${item.quantity}x)`).join('\n')}\n\n`;
    if (appliedCoupon) {
      text += `Cupom Aplicado: ${appliedCoupon.code} (${appliedCoupon.text})\n`;
      if (discountAmount > 0) {
        text += `Preço Original: R$ ${cartOriginalTotal.toFixed(2)}\n`;
        text += `*Total com Desconto: R$ ${cartTotalWithDiscount.toFixed(2)}*`;
      } else {
        text += `*Total: R$ ${cartOriginalTotal.toFixed(2)}*`;
      }
    } else {
      text += `*Total: R$ ${cartOriginalTotal.toFixed(2)}*`;
    }
    window.open(`https://wa.me/5521979284282?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCheckoutCounter = () => {
    const finalPrice = appliedCoupon ? cartTotalWithDiscount : cartOriginalTotal;
    alert(`Olá ${user.name}! Pedido reservado para retirada no balcão!\nTotal a pagar: R$ ${finalPrice.toFixed(2)}`);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCartOpen(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const timestamp = Date.now();
    const userMessage = { id: `user-${timestamp}`, text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      if (!response.ok) throw new Error('Erro no servidor');
      const data = await response.json();
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, text: data.reply || "Desculpe, não entendi.", sender: "bot" }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, text: "Ops! Tive um problema para conectar ao servidor.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    const servicosIds = {
      'banho e tosa': 1,
      'banho': 1,
      'tosa': 1,
      'consulta': 2,
      'hotel': 3
    };

    const payload = {
      pet_id: 1,
      client_id: 1,
      petshop_id: 1,
      service_id: servicosIds[appointment.service.toLowerCase().trim()] || 1,
      data: appointment.date.replace('T', ' ') + ':00',
      pet_name: appointment.petName
    };

    try {
      const response = await fetch('http://localhost:3000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`🎉 Sucesso! O agendamento do pet "${appointment.petName}" foi registrado no banco PostgreSQL e sincronizado direto no Google Calendar!`);
        setAppointment({ petName: '', ownerName: '', service: 'banho', date: '' });
        setCurrentPage('agenda');
      } else {
        alert(`Erro do Sistema: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Ops! Erro de conexão. Garanta que o servidor backend está rodando na porta 3000.');
    }
  }

  const theme = {
    bg: isDarkMode ? '#121212' : '#ffffff',
    text: isDarkMode ? '#f5f5f5' : '#333333',
    textLight: isDarkMode ? '#aaaaaa' : '#666666',
    navbarBg: isDarkMode ? '#1e1e1e' : '#ffffff',
    cardBg: isDarkMode ? '#1e1e1e' : '#ffffff',
    cardBorder: isDarkMode ? '#333333' : '#eee',
    sectionAlternative: isDarkMode ? '#1a1a1a' : '#f0f4f8',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff',
    inputBorder: isDarkMode ? '#444444' : '#ccc',
    chatMessageBg: isDarkMode ? '#1a1a1a' : '#f4f6f9',
    chatBubbleBot: isDarkMode ? '#2d2d2d' : '#ffffff'
  };

  if (!user) {
    return (
      <div style={{ ...styles.loginScreenWrapper, backgroundColor: isDarkMode ? '#121212' : '#f0f4f8' }}>
        <div style={{ ...styles.loginCard, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
          <div style={styles.loginLogo}>PetFlow</div>
          <p style={{ color: theme.textLight, marginBottom: '25px', fontSize: '14px' }}>
            {authMode === 'login' ? 'Entre para gerenciar os serviços do seu pet.' : 'Crie sua conta para acessar nossa plataforma.'}
          </p>
          <form onSubmit={handleAuthSubmit} style={{ textAlign: 'left' }}>
            {authMode === 'cadastro' && (
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: theme.text }}>Nome Completo:</label>
                <input type="text" required style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
              </div>
            )}
            <div style={styles.formGroup}>
              <label style={{ ...styles.label, color: theme.text }}>E-mail:</label>
              <input type="email" required style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            </div>
            <div style={styles.formGroup}>
              <label style={{ ...styles.label, color: theme.text }}>Senha:</label>
              <input type="password" required style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            </div>
            {authError && <p style={{ color: '#c62828', fontSize: '13px', fontWeight: '500', margin: '0 0 15px 0' }}>{authError}</p>}
            <button type="submit" style={{ ...styles.formBtn, marginBottom: '20px' }}>
              {authMode === 'login' ? 'Acessar Conta' : 'Finalizar Cadastro'}
            </button>
          </form>
          <button onClick={() => { setAuthMode(authMode === 'login' ? 'cadastro' : 'login'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: '#1e88e5', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>
            {authMode === 'login' ? 'Não tem conta? Cadastre-se aqui' : 'Já possui cadastro? Faça o login'}
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ ...styles.darkModeToggleBtn, margin: '20px auto 0 auto', backgroundColor: theme.inputBg, color: theme.text }}>
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.page, backgroundColor: theme.bg, color: theme.text }}>

      <nav style={{ ...styles.navbar, backgroundColor: theme.navbarBg, borderColor: theme.cardBorder }}>
        <div 
          onClick={() => setCurrentPage('inicio')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{ backgroundColor: '#1e88e5', color: '#ffffff', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(30,136,229,0.3)' }}>
            🌊
          </div>
          <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', background: 'linear-gradient(45deg, #1e88e5, #1565c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Pet<span style={{ WebkitTextFillColor: isDarkMode ? '#f5f5f5' : '#333333' }}>Flow</span>
          </span>
        </div>
        <div style={styles.navLinks} className="nav-links-container">
          <button onClick={() => setCurrentPage('inicio')} style={{ ...styles.navBtn, color: currentPage === 'inicio' ? '#1e88e5' : theme.textLight }}>Início</button>
          <button onClick={() => setCurrentPage('servicos_detalhes')} style={{ ...styles.navBtn, color: currentPage === 'servicos_detalhes' ? '#1e88e5' : theme.textLight }}>Preços e Serviços</button>
          <button onClick={() => setCurrentPage('loja')} style={{ ...styles.navBtn, color: currentPage === 'loja' ? '#1e88e5' : theme.textLight }}>Loja Pet</button>
          <button onClick={() => setCurrentPage('agenda')} style={{ ...styles.navBtn, color: currentPage === 'agenda' ? '#1e88e5' : theme.textLight }}>Agenda</button>
          <button onClick={() => setCurrentPage('contato')} style={{ ...styles.navBtn, color: currentPage === 'contato' ? '#1e88e5' : theme.textLight }}>Onde Estamos</button>
          <div style={styles.userInfoBox}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Olá, <strong>{user.name.split(' ')[0]}</strong></span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ ...styles.darkModeToggleBtn, backgroundColor: theme.inputBg, color: theme.text }}>
            {isDarkMode ? 'Claro' : 'Escuro'}
          </button>
          <button onClick={() => setIsCartOpen(!isCartOpen)} style={{ ...styles.navCartBtn, backgroundColor: theme.inputBg }}>
            Carrinho <span style={styles.cartBadge}>{totalItemsCount}</span>
          </button>
        </div>
      </nav>

      {isCartOpen && <div style={styles.cartOverlay} onClick={() => setIsCartOpen(false)} />}

      <div style={{ ...styles.sidebar, right: isCartOpen ? '0' : '-380px', backgroundColor: theme.navbarBg, color: theme.text }} className="sidebar-responsive">
        <div style={{ ...styles.sidebarHeader, borderColor: theme.cardBorder }}>
          <h3>Seu Carrinho</h3>
          <button onClick={clearAndCloseCart} style={styles.closeSidebarBtn}>X</button>
        </div>
        <div style={styles.sidebarBody}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: theme.textLight, marginTop: '40px' }}>Seu carrinho está vazio.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} style={{ ...styles.cartItem, backgroundColor: theme.inputBg, borderColor: theme.cardBorder }}>
                <div style={styles.cartItemIcon}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: theme.text }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold', fontSize: '13px' }}>R$ {item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div style={styles.quantityControls}>
                  <button onClick={() => removeFromCart(item.id)} style={{ ...styles.cartQuantityBtn, backgroundColor: theme.navbarBg, color: theme.text }}>-</button>
                  <button onClick={() => addToCart(item)} style={{ ...styles.cartQuantityBtn, backgroundColor: theme.navbarBg, color: theme.text }}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div style={{ ...styles.sidebarFooter, backgroundColor: theme.inputBg, borderColor: theme.cardBorder }}>
            <form onSubmit={handleApplyCoupon} style={styles.couponForm}>
              <input type="text" placeholder="Cupom (Ex: PETVIP10)" value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }} style={{ ...styles.couponInput, backgroundColor: theme.navbarBg, color: theme.text, borderColor: theme.cardBorder }} />
              <button type="submit" style={styles.couponBtn}>Aplicar</button>
            </form>
            {couponError && <span style={styles.couponErrorText}>{couponError}</span>}
            {appliedCoupon && (
              <div style={styles.appliedCouponBadge}>
                <span><strong>{appliedCoupon.text}</strong> ({appliedCoupon.code})</span>
                <button onClick={removeCoupon} style={styles.removeCouponBtn}>remover</button>
              </div>
            )}
            <hr style={{ border: '0', borderTop: '1px solid ' + theme.cardBorder, margin: '5px 0' }} />
            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <span style={discountAmount > 0 ? styles.slashedPrice : styles.boldPrice}>R$ {cartOriginalTotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <>
                {discountAmount > 0 && (
                  <div style={styles.totalRow}>
                    <span style={{ color: '#2e7d32' }}>Desconto:</span>
                    <span style={{ color: '#2e7d32', fontWeight: '500' }}>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={styles.totalRow}>
                  <span>Total Final:</span>
                  <strong style={{ color: '#2e7d32', fontSize: '20px' }}>R$ {cartTotalWithDiscount.toFixed(2)}</strong>
                </div>
              </>
            )}
            <button onClick={handleCheckoutWhatsApp} style={styles.checkoutBtnWhatsapp}>
              <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: '#fff' }}>
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.498 4.85 1.5c5.153.003 9.351-4.194 9.354-9.351.001-2.498-.971-4.846-2.738-6.615C16.488 2.918 14.144 1.945 11.64 1.946c-5.153 0-9.352 4.196-9.355 9.354-.001 1.701.464 3.328 1.345 4.755L2.61 21.39l5.437-1.423-.399-.214zM16.9 14.153c-.287-.143-1.697-.838-1.959-.933-.262-.096-.452-.143-.642.143-.19.286-.735.933-.902 1.123-.166.19-.332.214-.619.071-.286-.143-1.21-.446-2.305-1.424-.853-.76-1.429-1.7-1.596-1.986-.167-.286-.018-.441.125-.583.128-.128.287-.334.43-.501.142-.167.19-.286.286-.476.095-.19.047-.357-.024-.5-.071-.143-.642-1.548-.879-2.12-.23-.556-.464-.48-.642-.489-.166-.008-.356-.01-.547-.01-.19 0-.5.071-.76.357-.263.287-1.002 1.002-1.002 2.443 0 1.44 1.049 2.836 1.192 3.027.143.19 2.064 3.151 5.002 4.42.698.303 1.244.483 1.67.618.702.223 1.34.191 1.845.116.563-.083 1.697-.693 1.936-1.362.239-.668.239-1.24.167-1.362-.072-.122-.263-.194-.55-.337z" />
              </svg>
              Finalizar via WhatsApp
            </button>
            <button onClick={handleCheckoutCounter} style={styles.checkoutBtnCounter}>Finalizar no Balcão</button>
          </div>
        )}
      </div>

      {currentPage === 'inicio' && (
        <>
          <header style={styles.hero}>
            <div style={styles.heroOverlay}></div>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle} className="hero-title-responsive">O melhor cuidado para o seu melhor amigo</h1>
              <p style={styles.heroSubtitle} className="hero-subtitle-responsive">Profissionais qualificados, produtos premium e atenção de sobra para o seu pet.</p>
              <button onClick={() => document.getElementById('calculadora_section')?.scrollIntoView({ behavior: 'smooth' })} style={styles.heroBtn}>Calcular Dieta do Pet</button>
            </div>
          </header>

          <div style={{ ...styles.giftBanner, backgroundColor: isDarkMode ? '#1a237e' : '#e3f2fd', borderColor: '#1e88e5' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '16px', color: '#1e88e5' }}>Está com sorte hoje?</strong>
              <span style={{ fontSize: '14px', color: theme.textLight }}>Gire nossa roleta e ganhe um cupom ou benefício para o seu pet!</span>
            </div>
            <button onClick={() => setIsRouletteOpen(true)} style={styles.giftBannerBtn}>Girar a Roleta</button>
          </div>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Nossos Serviços Principais</h2>
            <p style={{ marginBottom: '30px', color: theme.textLight }}>Clique para ver mais detalhes e nossa tabela completa de preços</p>
            <div style={styles.grid}>
              <div style={{ ...styles.card, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} onClick={() => setCurrentPage('servicos_detalhes')}>
                <div style={styles.cardIconText}>Banho</div>
                <h3>Banho e Tosa</h3>
                <p style={{ color: theme.textLight }}>Estética completa com produtos premium e profissionais atenciosos.</p>
                <span style={styles.cardLink}>Ver Preços</span>
              </div>
              <div style={{ ...styles.card, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} onClick={() => setCurrentPage('servicos_detalhes')}>
                <div style={styles.cardIconText}>Vet</div>
                <h3>Veterinária</h3>
                <p style={{ color: theme.textLight }}>Consultas preventivas, vacinação e exames para a saúde do seu companheiro.</p>
                <span style={styles.cardLink}>Ver Preços</span>
              </div>
              <div style={{ ...styles.card, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} onClick={() => setCurrentPage('servicos_detalhes')}>
                <div style={styles.cardIconText}>Hotel</div>
                <h3>Hotelzinho</h3>
                <p style={{ color: theme.textLight }}>Hospedagem confortável e segura com recreação monitorada 24 horas.</p>
                <span style={styles.cardLink}>Ver Preços</span>
              </div>
            </div>
          </section>

          <section id="calculadora_section" style={{ ...styles.section, backgroundColor: theme.bg, borderTop: '1px solid ' + theme.cardBorder }}>
            <h2 style={styles.sectionTitle}>Calculadora de Ração Diária</h2>
            <p style={{ marginBottom: '30px', color: theme.textLight }}>Descubra a porção ideal diária para a saúde e energia do seu pet.</p>
            <div style={styles.calcContainer}>
              <form onSubmit={handleCalculateFood} style={{ ...styles.calcForm, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tipo de Pet:</label>
                  <select style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} value={calcPetType} onChange={(e) => { setCalcPetType(e.target.value); setCalcResult(null); }}>
                    <option value="cao">Cão</option>
                    <option value="gato">Gato</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Porte do Animal:</label>
                  <select style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} value={calcSize} onChange={(e) => setCalcSize(e.target.value)}>
                    <option value="pequeno">Pequeno</option>
                    <option value="medio">Médio</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Peso Exato (kg):</label>
                  <input type="number" step="0.1" min="0.1" placeholder="Ex: 8.5" style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} required value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nível de Atividade:</label>
                  <select style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} value={calcActivity} onChange={(e) => setCalcActivity(e.target.value)}>
                    <option value="calmo">Calmo / Caseiro</option>
                    <option value="ativo">Ativo / Passeador</option>
                  </select>
                </div>
                <button type="submit" style={styles.formBtn}>Calcular Porção</button>
              </form>
              {calcResult && (
                <div style={{ ...styles.calcResultBox, backgroundColor: isDarkMode ? '#0d47a1' : '#e3f2fd', borderColor: isDarkMode ? '#1565c0' : '#bbdefb' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: isDarkMode ? '#64b5f6' : '#1e88e5' }}>Resultado da Análise</h3>
                  <p style={{ fontSize: '16px', margin: '0 0 15px 0' }}>Seu pet precisa de aproximadamente <strong>{calcResult}g</strong> de ração por dia.</p>
                  {suggestedProduct && (
                    <div style={{ ...styles.suggestionBox, backgroundColor: theme.cardBg, borderColor: '#a5d6a7' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2e7d32', display: 'block', marginBottom: '5px' }}>SUGESTÃO PARA VOCÊ:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', marginBottom: '15px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e88e5' }}>{suggestedProduct.icon}</span>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', color: theme.text }}>{suggestedProduct.name}</h4>
                          <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '13px' }}>R$ {suggestedProduct.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => addToCart(suggestedProduct)} style={styles.productBtn}>Adicionar ao Carrinho</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section id="agendamento_section" style={{ ...styles.section, backgroundColor: theme.sectionAlternative }}>
            <h2 style={styles.sectionTitle}>Solicitar Agendamento Online</h2>
            <form onSubmit={handleAppointmentSubmit} style={{ ...styles.form, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="form-responsive">
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome do Pet:</label>
                <input type="text" style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} required value={appointment.petName} onChange={(e) => setAppointment({ ...appointment, petName: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tutor Responsável:</label>
                <input type="text" style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.textLight, borderColor: theme.inputBorder }} required disabled placeholder={user.name} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Serviço Desejado:</label>
                <select style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} value={appointment.service} onChange={(e) => setAppointment({ ...appointment, service: e.target.value })}>
                  <option value="banho">Banho e Tosa</option>
                  <option value="consulta">Consulta Veterinária</option>
                  <option value="hotel">Hotelzinho</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Data e Horário:</label>
                <input type="datetime-local" style={{ ...styles.formInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} required value={appointment.date} onChange={(e) => setAppointment({ ...appointment, date: e.target.value })} />
              </div>
              <button type="submit" style={styles.formBtn}>Enviar Solicitação</button>
            </form>
          </section>
        </>
      )}

      {currentPage === 'agenda' && (
        <section style={{ ...styles.innerSection, backgroundColor: theme.bg }}>
          <h2 style={styles.sectionTitle}>📅 Agenda Virtual PetFlow</h2>
          <p style={{ textAlign: 'center', color: theme.textLight, marginBottom: '30px' }}>
            Consulte os horários integrados em tempo real direto do **Google Calendar**.
          </p>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {calendarEvents.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed ' + theme.cardBorder, borderRadius: '12px' }}>
                <p style={{ color: theme.textLight }}>Nenhum agendamento ativo encontrado para as próximas datas na conta Google.</p>
              </div>
            ) : (
              calendarEvents.map((evt) => {
                const dataFormatada = evt.data 
                  ? new Date(evt.data).toLocaleString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) 
                  : 'Data não informada';

                return (
                  <div key={evt.id} style={{ padding: '20px', borderRadius: '12px', border: '1px solid ' + theme.cardBorder, backgroundColor: theme.cardBg, borderLeft: '6px solid #1e88e5', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: theme.text, fontWeight: 'bold' }}>
                        🐾 {evt.pet} — {evt.servico}
                      </h4>
                      <span style={{ fontSize: '13px', color: theme.textLight }}>
                        Sincronizado em tempo real com o Google Calendar
                      </span>
                    </div>
                    <div style={{ padding: '6px 14px', borderRadius: '25px', backgroundColor: isDarkMode ? '#1a237e' : '#e3f2fd', color: '#1e88e5', fontWeight: 'bold', fontSize: '13px' }}>
                      ⏱️ {dataFormatada}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {currentPage === 'servicos_detalhes' && (
        <section style={{ ...styles.innerSection, backgroundColor: theme.bg }}>
          <h2 style={styles.sectionTitle}>Serviços e Tabela de Preços</h2>
          <p style={{ textAlign: 'center', color: theme.textLight, marginBottom: '40px' }}>Oferecemos transparência e os melhores tratamentos para o bem-estar animal.</p>
          <div style={styles.priceContainer}>
            <div style={{ ...styles.priceItem, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <h3>Banho e Tosa Completa</h3>
              <p style={{ color: theme.textLight }}>Inclui corte de unhas, limpeza de ouvidos, banho terapêutico com shampoo neutro e secagem cuidadosa.</p>
              <div style={styles.priceBadge}>A partir de R$ 79,90</div>
            </div>
            <div style={{ ...styles.priceItem, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <h3>Consulta Veterinária</h3>
              <p style={{ color: theme.textLight }}>Avaliação detalhada com médicos veterinários experientes, prescrição de tratamentos e orientações gerais.</p>
              <div style={styles.priceBadge}>R$ 140,00</div>
            </div>
            <div style={{ ...styles.priceItem, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <h3>Aplicação de Vacinas (V10 / Antirrábica)</h3>
              <p style={{ color: theme.textLight }}>Proteção essencial importada com aplicação profissional e registro na carteirinha física ou digital.</p>
              <div style={styles.priceBadge}>R$ 95,00 (cada)</div>
            </div>
            <div style={{ ...styles.priceItem, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <h3>Hospedagem / Hotelzinho (Diária)</h3>
              <p style={{ color: theme.textLight }}>Quartos individuais higienizados, alimentação controlada, espaço amplo para socialização e fotos diárias via WhatsApp.</p>
              <div style={styles.priceBadge}>R$ 110,00 / dia</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button onClick={() => setCurrentPage('inicio')} style={styles.heroBtn}>Voltar para Início</button>
          </div>
        </section>
      )}

      {currentPage === 'loja' && (
        <section style={{ ...styles.innerSection, backgroundColor: theme.bg }}>
          <h2 style={styles.sectionTitle}>Nossa Loja PetFlow</h2>
          <p style={{ textAlign: 'center', color: theme.textLight, marginBottom: '40px' }}>Os melhores acessórios, rações e produtos selecionados para o seu companheiro.</p>
          <div style={styles.grid}>
            {products.map((product) => (
              <div key={product.id} style={{ ...styles.productCard, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
                <div style={{ ...styles.productImgPlaceholder, backgroundColor: theme.inputBg, color: '#1e88e5', fontWeight: 'bold', fontSize: '18px' }}>{product.icon}</div>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '15px' }}>{product.name}</h4>
                <p style={{ fontSize: '13px', color: theme.textLight, margin: '0 0 15px 0', flexGrow: 1 }}>{product.desc}</p>
                <div style={styles.productPrice}>R$ {product.price.toFixed(2)}</div>
                <button onClick={() => addToCart(product)} style={styles.productBtn}>Comprar</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {currentPage === 'contato' && (
        <section style={{ ...styles.innerSection, backgroundColor: theme.bg }}>
          <h2 style={styles.sectionTitle}>Onde Estamos Localizados</h2>
          <p style={{ textAlign: 'center', color: theme.textLight, marginBottom: '40px' }}>Venha nos visitar ou traga seu pet para conhecer nossas instalações.</p>
          <div style={styles.addressGrid}>
            <div style={{ ...styles.addressInfo, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <h3>Nosso Endereço</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6', color: theme.text }}>
                300 Brickell Ave<br />
                Miami, FL 33131<br />
                Estados Unidos
              </p>
              <h3 style={{ marginTop: '30px' }}>Horário de Funcionamento</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: theme.textLight }}>
                Segunda a Sexta: 08:00h às 19:00h<br />
                Sábados: 08:00h às 14:00h<br />
                Plantão Veterinário de Emergência: 24 horas.
              </p>
            </div>
            <div style={{ ...styles.mapContainer, borderColor: theme.cardBorder }}>
              <iframe src="https://maps.google.com/maps?q=300%20Brickell%20Ave,%20Miami,%20FL%2033131&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0, borderRadius: '12px' }} allowFullScreen="" loading="lazy" title="Mapa de Localização" />
            </div>
          </div>
        </section>
      )}

      {isRouletteOpen && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.rouletteModal, backgroundColor: theme.cardBg, color: theme.text }}>
            <button onClick={closeRouletteModal} style={{ ...styles.closeModalBtn, backgroundColor: theme.inputBg, color: theme.text }} disabled={isSpinning}>X</button>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: theme.text }}>Roleta de Benefícios</h3>
            <p style={{ margin: '0 0 25px 0', fontSize: '14px', color: theme.textLight }}>Gire a roleta para resgatar um benefício!</p>
            <div style={styles.wheelContainer}>
              <div style={styles.wheelPointer}>▼</div>
              <div style={{ width: '100%', height: '100%', transform: `rotate(${rouletteDegrees}deg)`, transition: isSpinning ? 'transform 3.5s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none' }}>
                <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', display: 'block' }}>
                  <path d="M 100 100 L 100 0 A 100 100 0 0 1 200 100 Z" fill={roulettePrizes[0].color} />
                  <path d="M 100 100 L 200 100 A 100 100 0 0 1 100 200 Z" fill={roulettePrizes[1].color} />
                  <path d="M 100 100 L 100 200 A 100 100 0 0 1 0 100 Z" fill={roulettePrizes[2].color} />
                  <path d="M 100 100 L 0 100 A 100 100 0 0 1 100 0 Z" fill={roulettePrizes[3].color} />
                  <text x="145" y="55" transform="rotate(45, 145, 55)" fill="#fff" fontWeight="bold" fontSize="9" textAnchor="middle">{roulettePrizes[0].text}</text>
                  <text x="145" y="145" transform="rotate(135, 145, 145)" fill="#fff" fontWeight="bold" fontSize="9" textAnchor="middle">{roulettePrizes[1].text}</text>
                  <text x="55" y="145" transform="rotate(225, 55, 145)" fill="#fff" fontWeight="bold" fontSize="9" textAnchor="middle">{roulettePrizes[2].text}</text>
                  <text x="55" y="55" transform="rotate(315, 55, 55)" fill="#fff" fontWeight="bold" fontSize="9" textAnchor="middle">{roulettePrizes[3].text}</text>
                  <circle cx="100" cy="100" r="12" fill="#333" />
                  <circle cx="100" cy="100" r="6" fill="#fff" />
                </svg>
              </div>
            </div>
            <button onClick={spinRoulette} style={styles.spinBtn} disabled={isSpinning}>
              {isSpinning ? 'Sorteando...' : 'Girar Roleta'}
            </button>
            {roulettePrize && (
              <div style={styles.rouletteResultBox}>
                <span style={{ fontSize: '15px', color: '#333' }}>Parabéns! Você ganhou:</span>
                <strong style={{ fontSize: '18px', color: '#2e7d32', display: 'block', margin: '5px 0' }}>{roulettePrize.text}</strong>
                <div style={styles.couponCopyContainer}>
                  <code style={styles.couponCodeDisplay}>{roulettePrize.coupon}</code>
                  <span style={{ fontSize: '11px', color: '#2e7d32', fontWeight: 'bold' }}>
                    {copiedNotification ? 'Copiado com sucesso!' : 'Copiando...'}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#777', margin: '10px 0 0 0' }}>Cole esse cupom no campo de descontos do seu carrinho!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p>© 2026 PetFlow. Todos os direitos reservados.</p>
      </footer>

      <div style={styles.chatWrapper}>
        <button onClick={() => setIsChatOpen(!isChatOpen)} style={styles.chatToggleBtn}>
          {isChatOpen ? 'Fechar' : 'Dúvidas?'}
        </button>
        {isChatOpen && (
          <div style={{ ...styles.chatContainer, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }} className="chat-container-responsive">
            <div style={styles.chatHeader}>
              <div style={styles.chatAvatar}>P</div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px' }}>PetBot</h4>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>Online</span>
              </div>
            </div>
            <div style={{ ...styles.chatMessageArea, backgroundColor: theme.chatMessageBg }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ ...styles.chatBubble, ...(msg.sender === 'user' ? styles.chatUserBubble : { ...styles.chatBotBubble, backgroundColor: theme.chatBubbleBot, color: theme.text }) }}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ ...styles.chatBubble, ...styles.chatBotBubble, backgroundColor: theme.chatBubbleBot, color: theme.textLight }}>
                  Digitando...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} style={{ ...styles.chatInputForm, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Pergunte algo..." style={{ ...styles.chatInput, backgroundColor: theme.bg, color: theme.text, borderColor: theme.inputBorder }} disabled={isTyping} />
              <button type="submit" style={styles.chatSendBtn} disabled={isTyping || !inputValue.trim()}>Enviar</button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}

const styles = {
  page: { fontFamily: '"Segoe UI", Roboto, sans-serif', margin: 0, padding: 0, width: '100%', overflowX: 'hidden', minHeight: '100vh' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000, width: '100%', borderBottom: '1px solid' },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#1e88e5', cursor: 'pointer' },
  navLinks: { display: 'flex', gap: '15px', alignItems: 'center' },
  navBtn: { background: 'none', border: 'none', fontSize: '15px', fontWeight: '500', cursor: 'pointer', transition: '0.2s', outline: 'none' },
  loginScreenWrapper: { width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  loginCard: { width: '100%', maxWidth: '420px', padding: '40px 35px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1px solid', textAlign: 'center' },
  loginLogo: { fontSize: '30px', fontWeight: 'bold', color: '#1e88e5', marginBottom: '10px' },
  userInfoBox: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' },
  logoutBtn: { background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textDecoration: 'underline' },
  darkModeToggleBtn: { border: 'none', fontSize: '13px', fontWeight: 'bold', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
  navCartBtn: { border: 'none', fontSize: '14px', fontWeight: 'bold', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' },
  cartBadge: { background: '#1e88e5', color: '#fff', fontSize: '12px', fontWeight: 'bold', padding: '2px 7px', borderRadius: '50%' },
  cartOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, transition: 'opacity 0.3s' },
  sidebar: { position: 'fixed', top: 0, width: '360px', height: '100vh', boxShadow: '-5px 0 25px rgba(0,0,0,0.15)', zIndex: 10000, display: 'flex', flexDirection: 'column', transition: 'right 0.3s ease-in-out' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid' },
  closeSidebarBtn: { background: '#ffebee', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', color: '#c62828', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  sidebarBody: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' },
  cartItem: { display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', border: '1px solid', borderRadius: '8px' },
  cartItemIcon: { fontSize: '14px', fontWeight: 'bold', color: '#1e88e5', width: '36px', textAlign: 'center' },
  quantityControls: { display: 'flex', gap: '6px' },
  cartQuantityBtn: { border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid', display: 'flex', flexDirection: 'column', gap: '12px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '16px', alignItems: 'center' },
  boldPrice: { fontSize: '18px', fontWeight: 'bold' },
  slashedPrice: { fontSize: '15px', textDecoration: 'line-through', color: '#888' },
  checkoutBtnWhatsapp: { width: '100%', padding: '14px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  checkoutBtnCounter: { width: '100%', padding: '14px', backgroundColor: '#1e88e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  hero: { height: '75vh', width: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(12, 24, 38, 0.6)', backdropFilter: 'blur(5px)', zIndex: 1 },
  heroContent: { maxWidth: '750px', position: 'relative', zIndex: 2, textAlign: 'center' },
  heroTitle: { fontSize: '46px', margin: '0 0 20px 0', fontWeight: '700', lineHeight: '1.2', color: '#ffffff' },
  heroSubtitle: { fontSize: '19px', margin: '0 0 35px 0', opacity: 0.95, color: '#f5f5f5' },
  heroBtn: { display: 'inline-block', padding: '14px 35px', backgroundColor: '#1e88e5', color: '#fff', border: 'none', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', cursor: 'pointer' },
  section: { padding: '40px 5% 60px 5%', textAlign: 'center', width: '100%' },
  innerSection: { padding: '40px 5%', width: '100%', minHeight: '80vh' },
  sectionTitle: { fontSize: '32px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' },
  grid: { display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap', width: '100%', padding: '20px 0' },
  card: { padding: '35px 25px', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)', width: '100%', maxWidth: '320px', flex: '1 1 280px', border: '1px solid', cursor: 'pointer', textAlign: 'center' },
  cardIconText: { fontSize: '13px', fontWeight: 'bold', color: '#1e88e5', backgroundColor: '#e3f2fd', padding: '10px 16px', borderRadius: '8px', display: 'inline-block', marginBottom: '15px', letterSpacing: '1px', textTransform: 'uppercase' },
  cardLink: { display: 'block', marginTop: '15px', color: '#1e88e5', fontWeight: '600', fontSize: '14px' },
  form: { maxWidth: '550px', margin: '0 auto', padding: '40px', borderRadius: '12px', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)', textAlign: 'left' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' },
  formInput: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid', outline: 'none' },
  formBtn: { width: '100%', padding: '14px', backgroundColor: '#1e88e5', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  priceContainer: { maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  priceItem: { padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid', position: 'relative', textAlign: 'left' },
  priceBadge: { padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', marginTop: '10px', display: 'inline-block', backgroundColor: '#e3f2fd', color: '#1e88e5' },
  productCard: { padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid', maxWidth: '280px', flex: '1 1 240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' },
  productImgPlaceholder: { width: '100%', padding: '20px 0', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  productPrice: { fontSize: '20px', fontWeight: 'bold', color: '#2e7d32', margin: '10px 0' },
  productBtn: { width: '100%', padding: '10px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  addressGrid: { display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px', width: '100%' },
  addressInfo: { flex: '1 1 300px', maxWidth: '500px', padding: '30px', borderRadius: '12px', border: '1px solid', textAlign: 'left' },
  mapContainer: { flex: '1 1 300px', maxWidth: '600px', height: '350px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid' },
  footer: { backgroundColor: '#1a1a1a', color: '#aaa', padding: '25px', textAlign: 'center', fontSize: '14px', width: '100%' },
  chatWrapper: { position: 'fixed', bottom: '25px', right: '25px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' },
  chatToggleBtn: { padding: '14px 28px', backgroundColor: '#1e88e5', color: 'white', border: 'none', borderRadius: '30px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  chatContainer: { width: '360px', height: '465px', border: '1px solid #e0e0e0', borderRadius: '16px', boxShadow: '0 10px 35px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHeader: { backgroundColor: '#1e88e5', color: '#fff', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' },
  chatAvatar: { width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' },
  chatMessageArea: { flex: 1, padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  chatBubble: { padding: '11px 15px', borderRadius: '14px', maxWidth: '80%', fontSize: '13px', lineHeight: '1.4', wordBreak: 'break-word' },
  chatUserBubble: { backgroundColor: '#1e88e5', color: '#fff', alignSelf: 'flex-end', borderBottomRightRadius: '2px' },
  chatBotBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: '2px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  chatInputForm: { display: 'flex', borderTop: '1px solid', padding: '12px', gap: '8px' },
  chatInput: { flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid', outline: 'none', fontSize: '13px' },
  chatSendBtn: { backgroundColor: '#1e88e5', border: 'none', color: '#fff', borderRadius: '20px', padding: '0 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  calcContainer: { display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto', textAlign: 'left' },
  calcForm: { flex: '1 1 350px', padding: '30px', borderRadius: '12px', border: '1px solid' },
  calcResultBox: { flex: '1 1 350px', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  suggestionBox: { padding: '15px', borderRadius: '8px', width: '100%', marginTop: '10px' },
  couponForm: { display: 'flex', gap: '8px', width: '100%', marginTop: '5px' },
  couponInput: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid', textTransform: 'uppercase', fontSize: '13px', outline: 'none' },
  couponBtn: { backgroundColor: '#555', color: '#fff', border: 'none', padding: '0 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' },
  couponErrorText: { color: '#c62828', fontSize: '12px', marginTop: '-4px', display: 'block', fontWeight: '500' },
  appliedCouponBadge: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: '#2e7d32' },
  removeCouponBtn: { background: 'none', border: 'none', color: '#c62828', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '12px' },
  giftBanner: { display: 'flex', alignItems: 'center', gap: '20px', maxWidth: '90%', width: '700px', margin: '40px auto 10px auto', padding: '15px 25px', border: '1px dashed', borderRadius: '12px', justifyContent: 'space-between', flexWrap: 'wrap', textAlign: 'left' },
  giftBannerBtn: { padding: '10px 20px', backgroundColor: '#f57c00', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  rouletteModal: { padding: '35px 30px', borderRadius: '20px', width: '90%', maxWidth: '420px', textAlign: 'center', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  closeModalBtn: { position: 'absolute', top: '15px', right: '15px', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' },
  wheelContainer: { position: 'relative', width: '280px', height: '280px', margin: '0 auto 25px auto' },
  wheelPointer: { position: 'absolute', top: '-14px', left: 'calc(50% - 14px)', fontSize: '28px', color: '#d32f2f', zIndex: 100 },
  spinBtn: { width: '100%', padding: '14px', backgroundColor: '#1e88e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,136,229,0.3)' },
  rouletteResultBox: { marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '10px' },
  couponCopyContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '5px' },
  couponCodeDisplay: { backgroundColor: '#fff', padding: '4px 10px', borderRadius: '4px', border: '1px dashed #2e7d32', fontWeight: 'bold', fontSize: '14px', color: '#333' }
};

export default App;