import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { AuthContext } from '../context/AuthContext';
import upiQrImg from '../assets/upi_qr.png';

const presetAmounts = [100, 250, 500, 1000, 2500];

const DonateModal = ({ rescue, onClose, onDonated }) => {
  const { user } = useContext(AuthContext);
  const [payTab, setPayTab] = useState('upi'); // 'upi' or 'razorpay'
  const [inputValue, setInputValue] = useState('');
  const [donating, setDonating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donatedAmount, setDonatedAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && !donating) onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, donating]);

  const progressPercent = Math.min(
    ((rescue.donationAmountRaised) / rescue.donationAmountNeeded) * 100,
    100
  );

  const finalAmount = Number(inputValue) || 0;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setError('');
    setDonating(true);

    try {
      const orderRes = await axios.post(`${API_URL}/api/payment/create-order`, {
        amount: finalAmount,
        rescueId: rescue._id
      });

      const { orderId, amount: orderAmount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount: orderAmount,
        currency: currency,
        name: 'Animal Rescue Network',
        description: `Donation for: ${rescue.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`${API_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              rescueId: rescue._id,
              amount: orderAmount
            });

            if (verifyRes.data.success) {
              setDonatedAmount(verifyRes.data.amountDonated);
              setSuccess(true);
              setDonating(false);
              setTimeout(() => {
                if (onDonated) onDonated();
                onClose();
              }, 3000);
            }
          } catch (verifyErr) {
            console.error('Verification failed:', verifyErr);
            setError('Payment was processed but verification failed. Please contact support.');
            setDonating(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [
                  { method: 'upi', flows: ['qr', 'collect', 'intent'] }
                ]
              }
            },
            sequence: ['block.upi', 'block.recommended'],
            preferences: { show_default_blocks: true }
          }
        },
        theme: { color: '#4F46E5' },
        modal: {
          ondismiss: function () { setDonating(false); }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setDonating(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setDonating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => { if (!donating) onClose(); }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-primaryDark p-5 text-white relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💝</span>
              <h3 className="text-xl font-extrabold">Donate to Help</h3>
            </div>
            <p className="text-white/80 text-sm font-medium">{rescue.title}</p>
          </div>
        </div>

        {success ? (
          <div className="p-10 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h4 className="text-2xl font-extrabold text-gray-900 mb-2">Thank You!</h4>
            <p className="text-gray-500 text-sm">
              Your donation of <span className="font-bold text-brand-primary">₹{donatedAmount}</span> has been recorded successfully.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Payment Verified
            </div>
            <p className="text-gray-400 text-xs mt-4">This window will close automatically...</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                <span>Raised so far</span>
                <span className="text-brand-primary">
                  ₹{rescue.donationAmountRaised} / ₹{rescue.donationAmountNeeded}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-primary to-emerald-400 h-2.5 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {progressPercent.toFixed(0)}% funded
              </p>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              <button 
                type="button"
                onClick={() => setPayTab('upi')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  payTab === 'upi' 
                    ? 'bg-white text-brand-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-base">📱</span> Scan & Pay (UPI)
              </button>
              <button 
                type="button"
                onClick={() => setPayTab('razorpay')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  payTab === 'razorpay' 
                    ? 'bg-white text-brand-primary shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-base">💳</span> Card / Razorpay
              </button>
            </div>

            {/* UPI QR Tab */}
            {payTab === 'upi' && (
              <div className="space-y-4">
                {/* QR Code */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <img 
                      src={upiQrImg} 
                      alt="Scan to pay via UPI" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-600 mt-3">
                    Scan with any UPI app
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg">📲</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Google Pay • PhonePe • Paytm • BHIM
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                  <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside">
                    <li>Open any <span className="font-bold text-gray-800">UPI app</span> on your phone</li>
                    <li>Scan the <span className="font-bold text-gray-800">QR code</span> above</li>
                    <li>Enter your <span className="font-bold text-gray-800">desired amount</span> and pay</li>
                  </ol>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition cursor-pointer text-sm"
                >
                  Close
                </button>
              </div>
            )}

            {/* Razorpay Tab */}
            {payTab === 'razorpay' && (
              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Enter Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-lg">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={inputValue}
                      onChange={(e) => { setInputValue(e.target.value); setError(''); }}
                      placeholder="e.g. 10, 50, 500..."
                      className="w-full border-2 border-gray-200 focus:border-brand-primary rounded-xl py-3 pl-10 pr-4 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Quick Pick */}
                <div className="flex flex-wrap gap-2">
                  {presetAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setInputValue(String(val)); setError(''); }}
                      className={`py-1.5 px-3 rounded-full text-xs font-bold border-2 transition-all cursor-pointer ${
                        Number(inputValue) === val
                          ? 'border-brand-primary bg-brand-primaryLight text-brand-primary shadow-sm scale-105'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-brand-primary/40 hover:bg-indigo-50/50'
                      }`}
                    >
                      ₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  Secured by Razorpay • 256-bit SSL
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-xs font-bold bg-red-50 border border-red-100 p-2.5 rounded-xl">
                    ⚠️ {error}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={donating}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition cursor-pointer text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDonate}
                    disabled={donating || !finalAmount || finalAmount <= 0}
                    className="flex-1 bg-gradient-to-r from-brand-primary to-brand-primaryDark hover:from-brand-primaryDark hover:to-brand-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {donating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay ₹${(finalAmount || 0).toLocaleString()}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonateModal;
