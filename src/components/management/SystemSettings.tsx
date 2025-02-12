import React, { useState, useEffect } from 'react';
import { Check, Upload, X, CreditCard, Barcode, QrCode } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

interface BrandSettings {
  name: string;
  logoUrl: string;
  sidebarColor: string;
}

interface CardInfo {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 229,
    features: [
      '5 usuários',
      'Chatbot para atendimento',
      'Painel de atendimento',
      'Integrações com redes sociais'
    ]
  },
  {
    id: 'advanced',
    name: 'Avançado',
    price: 419,
    features: [
      '15 usuários',
      'Chatbot e IA para atendimento personalizado',
      'Painel de atendimento',
      'Integração com redes sociais'
    ]
  },
  {
    id: 'enterprise',
    name: 'Empresarial tech+',
    price: 1249,
    features: [
      '30 usuários',
      'Chatbot e IA com integração API para atendimentos personalizados',
      'Painel de atendimento',
      'Integração com redes sociais',
      'Tokens ilimitados'
    ]
  }
];

const saveBrandSettings = (settings: BrandSettings) => {
  localStorage.setItem('brandSettings', JSON.stringify(settings));
};

const loadBrandSettings = (): BrandSettings => {
  const saved = localStorage.getItem('brandSettings');
  return saved ? JSON.parse(saved) : {
    name: 'Carbotech',
    logoUrl: '',
    sidebarColor: '#0d0764'
  };
};

const SystemSettings: React.FC = () => {
  const [colors, setColors] = useState({
    background: '#f9fafb',
    text: '#111827',
    sidebar: '#3B82F6'
  });
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(loadBrandSettings());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto' | 'card' | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    saveBrandSettings(brandSettings);
    document.documentElement.style.setProperty('--sidebar-color', brandSettings.sidebarColor);
  }, [brandSettings]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setColors(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandSettings(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const applyColors = () => {
    document.documentElement.style.setProperty('--bg-color', colors.background);
    document.documentElement.style.setProperty('--text-color', colors.text);
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlanId(planId);
    setShowPaymentModal(true);
    setPaymentMethod(null);
  };

  const handlePayment = () => {
    // Implementar integração com gateway de pagamento
    alert('Pagamento processado com sucesso!');
    setShowPaymentModal(false);
    setSelectedPlanId(null);
    setPaymentMethod(null);
    setCardInfo({
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Sistema</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações da Marca */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Configurações da Marca</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome da Plataforma
              </label>
              <input
                type="text"
                name="name"
                value={brandSettings.name}
                onChange={handleBrandSettingsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo da Plataforma
              </label>
              <div className="mt-1 flex items-center space-x-4">
                {brandSettings.logoUrl && (
                  <img
                    src={brandSettings.logoUrl}
                    alt="Logo"
                    className="h-12 w-12 object-contain"
                  />
                )}
                <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="h-5 w-5 mr-2 text-gray-500" />
                  Carregar Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cor da Barra Lateral
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  name="sidebarColor"
                  value={brandSettings.sidebarColor}
                  onChange={handleBrandSettingsChange}
                  className="h-8 w-8 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  name="sidebarColor"
                  value={brandSettings.sidebarColor}
                  onChange={handleBrandSettingsChange}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Customização de Cores */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Personalização de Cores</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cor de Fundo
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  name="background"
                  value={colors.background}
                  onChange={handleColorChange}
                  className="h-8 w-8 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  value={colors.background}
                  onChange={handleColorChange}
                  name="background"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cor do Texto
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <input
                  type="color"
                  name="text"
                  value={colors.text}
                  onChange={handleColorChange}
                  className="h-8 w-8 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  value={colors.text}
                  onChange={handleColorChange}
                  name="text"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={applyColors}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Aplicar Cores
            </button>
          </div>
        </div>

        {/* Planos */}
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Planos Disponíveis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative rounded-lg border-2 border-gray-200 p-6"
              >
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  R$ {plan.price}
                  <span className="text-sm font-normal text-gray-500">/mês</span>
                </p>
                
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check size={16} className="mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.id)}
                  className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Quero contratar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedPlanId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Escolha a forma de pagamento</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setPaymentMethod('pix')}
                  className={`w-full flex items-center p-4 border rounded-lg ${
                    paymentMethod === 'pix' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <QrCode className="h-6 w-6 text-gray-500" />
                  <span className="ml-3">PIX</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('boleto')}
                  className={`w-full flex items-center p-4 border rounded-lg ${
                    paymentMethod === 'boleto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Barcode className="h-6 w-6 text-gray-500" />
                  <span className="ml-3">Boleto à vista</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center p-4 border rounded-lg ${
                    paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="h-6 w-6 text-gray-500" />
                  <span className="ml-3">Cartão de crédito ou débito</span>
                </button>

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        value={cardInfo.number}
                        onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                        placeholder="0000 0000 0000 0000"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                        placeholder="Nome como está no cartão"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Data de Validade
                        </label>
                        <input
                          type="text"
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                          placeholder="MM/AA"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                          placeholder="123"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod && (
                  <button
                    onClick={handlePayment}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Finalizar Pagamento
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;