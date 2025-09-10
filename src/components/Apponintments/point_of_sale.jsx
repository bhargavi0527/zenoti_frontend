import React, { useState, useEffect } from 'react';
import NewGuestModal from './new_guest_modal';
// ProductSalesTab is defined in this file below


export default function PointOfSale() {
  const [gender, setGender] = useState('');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [paymentMethod, setPaymentMethod] = useState('custom');
  const [customPayment, setCustomPayment] = useState('');
  const [activeItemTab, setActiveItemTab] = useState('package');
  const [saleBy, setSaleBy] = useState('Koyyana Sai Mythree');
  // Header guest form state
  const [guestCode, setGuestCode] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [mobileCountry, setMobileCountry] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  // Prepaid card form state
  const [prepaidCardNumber, setPrepaidCardNumber] = useState('');
  const [prepaidPrice, setPrepaidPrice] = useState('');
  const [prepaidNotes, setPrepaidNotes] = useState('');
  const [prepaidExpiryDate, setPrepaidExpiryDate] = useState('');
  const [prepaidExpiryDays, setPrepaidExpiryDays] = useState('3650');
  const [prepaidOneTime, setPrepaidOneTime] = useState(false);
  // Gift card form state
  const [giftCardNumber, setGiftCardNumber] = useState('');
  const [giftType, setGiftType] = useState('amount'); // 'amount' | 'service'
  const [giftPrice, setGiftPrice] = useState('');
  const [giftNotesOpen, setGiftNotesOpen] = useState(false);
  const [giftNotes, setGiftNotes] = useState('');
  const [giftBuyingFor, setGiftBuyingFor] = useState('self'); // 'self' | 'others'
  const [giftEmailSend, setGiftEmailSend] = useState(false);
  const [giftExpiryMode, setGiftExpiryMode] = useState('date'); // 'date'
  const [giftExpiryDate, setGiftExpiryDate] = useState('');
  const [giftServiceDialogOpen, setGiftServiceDialogOpen] = useState(false);
  const [giftOthersDialogOpen, setGiftOthersDialogOpen] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [newGuestOpen, setNewGuestOpen] = useState(false);
  // Service tab state
  const [svcName, setSvcName] = useState('');
  const [svcQty, setSvcQty] = useState(1);
  const [svcPrice, setSvcPrice] = useState('');
  const [svcRoom, setSvcRoom] = useState('N/A');
  const [svcStart, setSvcStart] = useState('10:00 AM');
  const [svcEnd, setSvcEnd] = useState('10:15 AM');
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  // Package tab state
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  // Payment state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestFound, setGuestFound] = useState(false);
  const [guestId, setGuestId] = useState('');
  const [availableInvoices, setAvailableInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const timeOptions = [
    '09:00 AM','09:15 AM','09:30 AM','09:45 AM',
    '10:00 AM','10:15 AM','10:30 AM','10:45 AM',
    '11:00 AM','11:15 AM','11:30 AM','11:45 AM',
    '12:00 PM','12:15 PM','12:30 PM','12:45 PM',
    '01:00 PM','01:15 PM','01:30 PM','01:45 PM',
    '02:00 PM','02:15 PM','02:30 PM','02:45 PM',
    '03:00 PM'
  ];
  // Check payment state
  const [checkNumber, setCheckNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [checkDate, setCheckDate] = useState('');
  // Credit/Debit payment state
  const [cardType, setCardType] = useState('Debit Card');
  const [cardLast4, setCardLast4] = useState('');
  const [terminal, setTerminal] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [cardBankName, setCardBankName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  // Prepaid/Gift payment state
  const [prepaidGiftCardNumber, setPrepaidGiftCardNumber] = useState('');
  // Loyalty points state
  const [loyaltyProgram, setLoyaltyProgram] = useState('');
  const [loyaltyAmount, setLoyaltyAmount] = useState('0.00');
  const [loyaltyPoints, setLoyaltyPoints] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [centerName, setCenterName] = useState('Corporate Training Center');
  // Payment screen state
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [outstandingBalance, setOutstandingBalance] = useState(172671.50);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [printLoading, setPrintLoading] = useState(false);

  // Function to automatically update payment amount when package or service is selected
  const updatePaymentAmount = () => {
    let totalAmount = 0;
    
    // Add package amount if selected
    if (selectedPackage && packagePrice) {
      totalAmount += parseFloat(packagePrice) || 0;
    }
    
    // Add service amount if selected
    if (svcName && svcPrice && svcQty) {
      totalAmount += (parseFloat(svcPrice) || 0) * svcQty;
    }
    
    // Add prepaid card amount if selected
    if (prepaidCardNumber && prepaidPrice) {
      totalAmount += parseFloat(prepaidPrice) || 0;
    }
    
    // Add gift card amount if selected
    if (giftCardNumber && giftPrice) {
      totalAmount += parseFloat(giftPrice) || 0;
    }
    
    const newAmount = totalAmount.toFixed(2);
    console.log('Auto-calculating payment amount:', {
      selectedPackage,
      packagePrice,
      svcName,
      svcPrice,
      svcQty,
      prepaidCardNumber,
      prepaidPrice,
      giftCardNumber,
      giftPrice,
      totalAmount: newAmount
    });
    setAmount(newAmount);
  };

  // Function to submit payment to API
  const submitPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setPaymentError('Please enter a valid amount');
      return;
    }

    // Validate that at least one item is selected
    if (!selectedPackage && !svcName && !prepaidCardNumber && !giftCardNumber) {
      setPaymentError('Please select at least one item (package, service, prepaid card, or gift card)');
      return;
    }

    // If no invoice ID, try to get or create one
    if (!invoiceId && guestId) {
      setPaymentError('Creating invoice for guest...');
      setPaymentLoading(true);
      try {
        await getOrCreateInvoice(guestId);
        // Wait a moment for the invoice to be set
        setTimeout(() => {
          if (invoiceId) {
            submitPayment();
          } else {
            setPaymentError('Failed to create invoice. Please try again.');
            setPaymentLoading(false);
          }
        }, 1000);
        return;
      } catch (error) {
        setPaymentError('Failed to create invoice for guest');
        setPaymentLoading(false);
        return;
      }
    }

    if (!invoiceId) {
      setPaymentError('Invoice ID is required. Please ensure guest is selected.');
      return;
    }

    // Validate that invoice ID is a proper UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(invoiceId)) {
      setPaymentError('Invalid invoice ID format. Please try again.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError('');

    try {
      const paymentData = {
        payment_method: paymentMethod.toUpperCase(),
        amount: parseFloat(amount),
        reference_no: `TXN${Date.now().toString(16).toUpperCase()}`,
        remarks: `Payment for ${activeItemTab} - ${selectedPackage || svcName || 'item'}`,
        invoice_id: invoiceId
      };

      const response = await fetch('http://127.0.0.1:8000/payments/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Payment successful:', result);
      setPaymentSuccess(true);
      setPaymentError('');
      
      // Store current payment details and show payment screen
      const paymentDetails = {
        id: result.id || `TXN${Date.now()}`,
        amount: parseFloat(amount),
        method: paymentMethod,
        date: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        invoiceId: invoiceId,
        invoiceNumber: invoiceNumber,
        items: {
          package: selectedPackage,
          service: svcName,
          prepaid: prepaidCardNumber,
          gift: giftCardNumber
        },
        guest: {
          name: `${firstName} ${lastName}`,
          email: email,
          phone: `${mobileCountry} ${mobileNumber}`
        }
      };
      
      setCurrentPayment(paymentDetails);
      
      // Add to payment history
      setPaymentHistory(prev => [paymentDetails, ...prev]);
      
      // Show payment screen
      setShowPaymentScreen(true);
      
      // Reset form after successful payment
      setTimeout(() => {
        setPaymentSuccess(false);
        setAmount('0.00');
        setSelectedPackage('');
        setPackagePrice('');
        setSvcName('');
        setSvcPrice('');
        setSvcQty(1);
        setPrepaidCardNumber('');
        setPrepaidPrice('');
        setGiftCardNumber('');
        setGiftPrice('');
        setActiveItemTab('package');
        setPaymentMethod('custom');
        setCheckNumber('');
        setBankName('');
        setCheckDate('');
        setCardType('Debit Card');
        setCardLast4('');
        setTerminal('');
        setReceiptNumber('');
        setCardBankName('');
        setCardExpiry('');
        setPrepaidGiftCardNumber('');
        setLoyaltyProgram('');
        setLoyaltyAmount('0.00');
        setLoyaltyPoints('');
        setCustomPayment('');
      }, 2000);

    } catch (error) {
      console.error('Payment submission failed:', error);
      setPaymentError(error.message || 'Payment submission failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Function to clear all form data
  const clearForm = () => {
    setAmount('0.00');
    setSelectedPackage('');
    setPackagePrice('');
    setSvcName('');
    setSvcPrice('');
    setSvcQty(1);
    setPrepaidCardNumber('');
    setPrepaidPrice('');
    setGiftCardNumber('');
    setGiftPrice('');
    setActiveItemTab('package');
    setPaymentMethod('custom');
    setCheckNumber('');
    setBankName('');
    setCheckDate('');
    setCardType('Debit Card');
    setCardLast4('');
    setTerminal('');
    setReceiptNumber('');
    setCardBankName('');
    setCardExpiry('');
    setPrepaidGiftCardNumber('');
    setLoyaltyProgram('');
    setLoyaltyAmount('0.00');
    setLoyaltyPoints('');
    setCustomPayment('');
    setPaymentError('');
    setPaymentSuccess(false);
    
    // Clear guest data
    setGuestCode('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setGender('');
    setIsMinor(false);
    setMobileCountry('+91');
    setMobileNumber('');
    setCenterName('Corporate Training Center');
    setGuestFound(false);
    setGuestId('');
    setAvailableInvoices([]);
    setInvoiceId('');
    setInvoiceNumber('');
  };

  // Function to get or create invoice for a guest
  const getOrCreateInvoice = async (guestId) => {
    if (!guestId) return null;
    
    setInvoicesLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoices/get-or-create/${guestId}`, {
        method: 'POST',
        headers: { 
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (!res.ok) {
        console.log('Failed to get or create invoice:', res.status);
        setPaymentError('Failed to create invoice for guest');
        return;
      }
      
      const result = await res.json();
      console.log('Invoice result:', result);
      
      if (result.invoice_id) {
        setInvoiceId(result.invoice_id);
        setAvailableInvoices([result.invoice_id]);
        // Set invoice number if available
        if (result.invoice_no) {
          setInvoiceNumber(result.invoice_no);
        }
        console.log('Invoice ready:', result.invoice_id, 'Invoice number:', result.invoice_no);
        return { invoiceId: result.invoice_id, invoiceNo: result.invoice_no };
      } else {
        setPaymentError('No invoice ID returned from server');
      }
      
    } catch (error) {
      console.error('Failed to get or create invoice:', error);
      setPaymentError('Failed to create invoice for guest');
    } finally {
      setInvoicesLoading(false);
    }
    return null;
  };

  // Function to fetch invoice details by ID
  const fetchInvoiceDetails = async (invoiceId) => {
    if (!invoiceId) return;
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoices/${invoiceId}`, {
        headers: { accept: 'application/json' }
      });
      
      if (res.ok) {
        const invoiceData = await res.json();
        console.log('Invoice details:', invoiceData);
        if (invoiceData.invoice_no) {
          setInvoiceNumber(invoiceData.invoice_no);
        }
      } else {
        console.log('Failed to fetch invoice details:', res.status);
      }
    } catch (error) {
      console.error('Failed to fetch invoice details:', error);
    }
  };

  // Function to fetch invoices for a guest (fallback method)
  const fetchGuestInvoices = async (guestId) => {
    if (!guestId) return;
    
    setInvoicesLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/invoices/guest/${guestId}/ids`, {
        headers: { accept: 'application/json' }
      });
      
      if (!res.ok) {
        console.log('Failed to fetch invoices:', res.status);
        return;
      }
      
      const invoiceIds = await res.json();
      console.log('Available invoices:', invoiceIds);
      setAvailableInvoices(invoiceIds);
      
      // Set the first available invoice as default
      if (invoiceIds.length > 0) {
        setInvoiceId(invoiceIds[0]);
        // Fetch invoice details to get invoice number
        fetchInvoiceDetails(invoiceIds[0]);
      }
      
    } catch (error) {
      console.error('Failed to fetch guest invoices:', error);
    } finally {
      setInvoicesLoading(false);
    }
  };

  // Removed random invoice generator to avoid non-UUID invoice IDs

  // Update payment amount whenever relevant fields change
  useEffect(() => {
    updatePaymentAmount();
  }, [selectedPackage, packagePrice, svcName, svcPrice, svcQty, prepaidCardNumber, prepaidPrice, giftCardNumber, giftPrice]);

  // Fetch invoice details when invoice ID changes
  useEffect(() => {
    if (invoiceId && !invoiceNumber) {
      fetchInvoiceDetails(invoiceId);
    }
  }, [invoiceId]);

  // Function to print/download invoice
  const printInvoice = async () => {
    if (!invoiceId) {
      setPaymentError('No invoice available to print');
      return;
    }

    setPrintLoading(true);
    try {
      // Try different possible endpoints for invoice printing
      const endpoints = [
        `http://127.0.0.1:8000/invoices/${invoiceId}/download`,
        `http://127.0.0.1:8000/invoices/${invoiceId}/pdf`,
        `http://127.0.0.1:8000/invoices/${invoiceId}/print`,
        `http://127.0.0.1:8000/invoices/print/${invoiceId}`,
        `http://127.0.0.1:8000/invoices/${invoiceId}/export`
      ];

      let response = null;
      let workingEndpoint = null;

      // Try each endpoint until one works
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'accept': 'application/pdf, application/json'
            }
          });

          if (response.ok) {
            workingEndpoint = endpoint;
            break;
          } else {
            console.log(`Endpoint ${endpoint} failed with status:`, response.status);
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed with error:`, err);
        }
      }

      if (!response || !response.ok) {
        // If no endpoint works, try to get invoice details and create a simple PDF
        console.log('No print endpoint found, creating simple invoice display');
        createSimpleInvoicePDF();
        return;
      }

      // Check if response is JSON (error) or PDF
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.log('API returned JSON error:', errorData);
        throw new Error(errorData.detail || 'Failed to generate invoice');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with invoice number or ID
      const filename = invoiceNumber ? `Invoice_${invoiceNumber}.pdf` : `Invoice_${invoiceId}.pdf`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Invoice downloaded successfully from:', workingEndpoint);
      
    } catch (error) {
      console.error('Failed to print invoice:', error);
      setPaymentError(`Failed to download invoice: ${error.message}`);
    } finally {
      setPrintLoading(false);
    }
  };

  // Fallback function to create a simple invoice PDF
  const createSimpleInvoicePDF = () => {
    try {
      // Create a simple HTML invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoiceNumber || invoiceId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-details { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <h2>${centerName}</h2>
          </div>
          
          <div class="invoice-details">
            <p><strong>Invoice No:</strong> ${invoiceNumber || invoiceId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Guest:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${mobileCountry} ${mobileNumber}</p>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedPackage ? `
                <tr>
                  <td>${selectedPackage}</td>
                  <td>1</td>
                  <td>₹${packagePrice}</td>
                  <td>₹${packagePrice}</td>
                </tr>
              ` : ''}
              ${svcName ? `
                <tr>
                  <td>${svcName}</td>
                  <td>${svcQty}</td>
                  <td>₹${svcPrice}</td>
                  <td>₹${(parseFloat(svcPrice) * svcQty).toFixed(2)}</td>
                </tr>
              ` : ''}
              ${prepaidCardNumber ? `
                <tr>
                  <td>Prepaid Card: ${prepaidCardNumber}</td>
                  <td>1</td>
                  <td>₹${prepaidPrice}</td>
                  <td>₹${prepaidPrice}</td>
                </tr>
              ` : ''}
              ${giftCardNumber ? `
                <tr>
                  <td>Gift Card: ${giftCardNumber}</td>
                  <td>1</td>
                  <td>₹${giftPrice}</td>
                  <td>₹${giftPrice}</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
          
          <div class="total">
            <p><strong>Total Amount: ₹${amount}</strong></p>
          </div>
          
          <div style="margin-top: 30px;">
            <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
            <p><strong>Sale By:</strong> ${saleBy}</p>
          </div>
        </body>
        </html>
      `;

      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      console.log('Simple invoice opened for printing');
      
    } catch (error) {
      console.error('Failed to create simple invoice:', error);
      setPaymentError('Failed to generate invoice. Please try again.');
    } finally {
      setPrintLoading(false);
    }
  };

  const fetchGuestByCode = async (code) => {
    const trimmed = (code || '').trim();
    if (!trimmed) return;
    
    setGuestLoading(true);
    setGuestFound(false);
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/guests/code/${encodeURIComponent(trimmed)}`, {
        headers: { accept: 'application/json' }
      });
      
      if (!res.ok) {
        console.log('Guest not found or error:', res.status);
        setGuestFound(false);
        return;
      }
      
      const data = await res.json();
      console.log('Guest data fetched:', data);
      
      setCenterName(data?.center_name || '');
      setFirstName(data?.first_name || '');
      setLastName(data?.last_name || '');
      setEmail(data?.email || '');
      setGender(data?.gender || '');
      setIsMinor(Boolean(data?.is_minor));
      
      // Handle phone number parsing
      const cc = data?.home_no || '';
      const fullPhone = data?.phone_no || '';
      const local = cc && fullPhone.startsWith(cc) ? fullPhone.slice(cc.length) : fullPhone;
      setMobileCountry(cc || '+91');
      setMobileNumber(local || '');
      
      // Set guest code if not already set
      if (data?.guest_code && !guestCode) {
        setGuestCode(data.guest_code);
      }
      
      // Set guest ID and get or create invoice immediately
      if (data?.id) {
        setGuestId(data.id);
        const created = await getOrCreateInvoice(data.id);
        if (created?.invoiceId) {
          setInvoiceId(created.invoiceId);
          if (created.invoiceNo) setInvoiceNumber(created.invoiceNo);
        } else {
          // Fallback: fetch existing invoices if any
          fetchGuestInvoices(data.id);
        }
      }
      
      setGuestFound(true);
      
    } catch (err) {
      console.error('Failed to fetch guest by code', err);
      setGuestFound(false);
    } finally {
      setGuestLoading(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const res = await fetch('http://127.0.0.1:8000/services/', { headers: { accept: 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setServices(data);
      } catch (e) {
        console.error('Failed to fetch services', e);
      } finally {
        setServicesLoading(false);
      }
    };
    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        const res = await fetch('http://127.0.0.1:8000/rooms/', { headers: { accept: 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setRooms(data);
      } catch (e) {
        console.error('Failed to fetch rooms', e);
      } finally {
        setRoomsLoading(false);
      }
    };
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);
        const res = await fetch('http://127.0.0.1:8000/packages/', { headers: { accept: 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setPackages(data);
      } catch (e) {
        console.error('Failed to fetch packages', e);
      } finally {
        setPackagesLoading(false);
      }
    };
    fetchServices();
    fetchRooms();
    fetchPackages();
  }, []);

  return (
    <>
     {/* Full-width page header */}
     <div className="w-full border-b bg-gray-50 mb-3">
       <div className="px-4 py-2">
       
         <div className="flex items-center gap-6 mb-2">
           <label className="text-sm text-gray-700 flex items-center gap-2">
             <input type="checkbox" className="h-3 w-3 accent-blue-200" />
             across centers
           </label>
           <label className="text-sm text-gray-700 flex items-center gap-2">
             <input type="checkbox" className="h-3 w-3 accent-blue-600" checked={isMinor} onChange={(e)=>setIsMinor(e.target.checked)} />
             Guest is a minor
           </label>
         </div>
         <div className="grid grid-cols-12 gap-2 items-center">
           <div className="col-span-2">
             <div className="text-xs text-gray-600 mb-1">Code</div>
             <div className="relative">
               <input 
                 className={`w-full border rounded px-2 py-1 text-sm pr-8 ${
                   guestFound ? 'border-green-500 bg-green-50' : 
                   guestLoading ? 'border-blue-500' : 
                   'border-gray-300'
                 }`} 
                 value={guestCode} 
                 onChange={(e)=>setGuestCode(e.target.value)} 
                 onBlur={()=>fetchGuestByCode(guestCode)} 
                 onKeyDown={(e)=>{ if(e.key==='Enter'){ fetchGuestByCode(guestCode); } }} 
                 placeholder="Enter guest code" 
               />
               {guestLoading && (
                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
                   <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                 </div>
               )}
               {guestFound && (
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                   ✓
                 </div>
               )}
             </div>
                            {guestFound && (
                 <button 
                   onClick={() => {
                     setGuestCode('');
                     setFirstName('');
                     setLastName('');
                     setEmail('');
                     setGender('');
                     setIsMinor(false);
                     setMobileCountry('+91');
                     setMobileNumber('');
                     setCenterName('Corporate Training Center');
                     setGuestFound(false);
                     setGuestId('');
                     setAvailableInvoices([]);
                     setInvoiceId('');
                     setInvoiceNumber('');
                   }}
                   className="mt-1 text-xs text-red-600 hover:text-red-800"
                 >
                   Clear Guest
                 </button>
               )}
           </div>
           <div className="col-span-3">
             <div className="text-xs text-gray-600 mb-1">Mobile</div>
             <div className="flex gap-2">
               <input className="w-14 border rounded px-2 py-1 text-sm" value={mobileCountry} onChange={(e)=>setMobileCountry(e.target.value)} />
               <input className="flex-1 border rounded px-2 py-1 text-sm" value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)} />
             </div>
           </div>
           <div className="col-span-3">
             <div className="text-xs text-gray-600 mb-1">First *</div>
             <input className="w-full border rounded px-2 py-1 text-sm" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
           </div>
           <div className="col-span-4">
             <div className="text-xs text-gray-600 mb-1">Last *</div>
             <input className="w-full border rounded px-2 py-1 text-sm" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
           </div>
         </div>
         <div className="grid grid-cols-12 gap-2 items-center mt-2">
           <div className="col-span-4">
             <div className="text-xs text-gray-600 mb-1">Gender *</div>
             <select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
               <option value="">Select Gender</option>
               <option>Female</option>
               <option>Male</option>
               <option>Other</option>
             </select>
           </div>
           <div className="col-span-4">
             <div className="text-xs text-gray-600 mb-1">Email *</div>
             <input className="w-full border rounded px-2 py-1 text-sm" value={email} onChange={(e)=>setEmail(e.target.value)} />
           </div>
           <div className="col-span-4">
             <div className="text-xs text-gray-600 mb-1">Referral</div>
             <select value={source} onChange={(e)=>setSource(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
               <option value="">Select Source</option>
               <option>Facebook</option>
               <option>Instagram</option>
               <option>Walk-in</option>
             </select>
           </div>
         </div>
         
         {/* Guest found success message */}
         {guestFound && (
           <div className="mt-2 p-2 bg-green-100 border border-green-300 text-green-700 rounded text-sm">
             ✓ Guest found: {firstName} {lastName} from {centerName}
           </div>
         )}
       </div>
     </div>

     <div className="grid grid-cols-12 gap-4">
          {/* Left: Guest & items (header now contains the guest form) */}
          <div className="col-span-6 border rounded-md p-3">
            <div className="mb-4">
              <div className="mb-2 text-sm text-gray-800"><span className="font-medium">Center Name</span> {centerName}</div>
              <div className="flex items-center gap-3 text-sm text-gray-800">
                <div className="font-medium">Invoice No</div>
                
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              
            </div>
            <div className="mt-6 space-y-4">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                💡 <strong>Tip:</strong> When you select packages, services, or cards, the payment amount will be automatically calculated and filled in the payment section.
              </div>
              <div>
                <div className="text-sm text-gray-700 mb-1">Packages</div>
                <div className="flex gap-2 items-center">
                  <select 
                    value={selectedPackage} 
                    onChange={(e) => {
                      const selectedPkg = e.target.value;
                      setSelectedPackage(selectedPkg);
                      const pkg = packages.find(p => p.name === selectedPkg);
                      if (pkg && typeof pkg.series_package_cost_to_center !== 'undefined') {
                        setPackagePrice(String(pkg.series_package_cost_to_center));
                      }
                    }}
                    className="w-60 border rounded px-2 py-1 text-sm"
                  >
                    <option value="">{packagesLoading ? 'Loading…' : 'Select package'}</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button className="h-8 w-8 rounded border text-blue-600">▶</button>
                    <button className="h-8 w-8 rounded border text-blue-600">⟲</button>
                    <button className="h-8 w-8 rounded border text-blue-600">✕</button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1">Memberships</div>
                <div className="flex gap-2 items-center">
                  <select className="w-60 border rounded px-2 py-1 text-sm">
                    <option>Select</option>
                  </select>
                  <div className="flex gap-2">
                    <button className="h-8 w-8 rounded border text-blue-600">▶</button>
                    <button className="h-8 w-8 rounded border text-blue-600">⟲</button>
                    <button className="h-8 w-8 rounded border text-blue-600">✕</button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1">Coupon/ Voucher</div>
                <div className="flex gap-2 items-center">
                  <input className="w-60 border rounded px-2 py-1 text-sm" />
                  <div className="flex gap-2">
                    <button className="h-8 w-8 rounded border text-blue-600">▶</button>
                    <button className="h-8 w-8 rounded border text-blue-600">✕</button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1">Comments</div>
                <textarea className="w-full h-24 border rounded px-2 py-1 text-sm" placeholder="Comments are auto-saved." />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex text-sm border-b">
                {[
                  { key: 'package', label: 'Package' },
                  { key: 'membership', label: 'Membership' },
                  { key: 'prepaid', label: 'Prepaid Card' },
                  { key: 'gift', label: 'Gift Card' },
                  { key: 'service', label: 'Service' },
                  { key: 'product', label: 'Products' }, // <-- Add Products tab
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveItemTab(t.key)}
                    className={`px-4 py-2 border-b-2 -mb-px ${activeItemTab===t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-700 hover:text-blue-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="p-4 border rounded-b rounded-tr">
                {activeItemTab === 'package' && (
                  <div className="grid grid-cols-12 gap-x-8 gap-y-4">
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Package</div>
                      <select
                        value={selectedPackage}
                        onChange={(e) => {
                          const selectedPkg = e.target.value;
                          setSelectedPackage(selectedPkg);
                          const pkg = packages.find(p => p.name === selectedPkg);
                          if (pkg && typeof pkg.series_package_cost_to_center !== 'undefined') {
                            setPackagePrice(String(pkg.series_package_cost_to_center));
                          }
                        }}
                        className="w-72 border rounded px-2 py-1 text-sm bg-white"
                      >
                        <option value="">{packagesLoading ? 'Loading…' : 'Select package'}</option>
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Price</div>
                      <input 
                        value={packagePrice} 
                        onChange={(e) => setPackagePrice(e.target.value)} 
                        className="w-40 border rounded px-2 py-1 text-sm" 
                        placeholder="Package price"
                      />
                    </div>
                    {selectedPackage && (
                      <div className="col-span-12">
                        <div className="text-sm text-gray-700 mb-1">Description</div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {packages.find(p => p.name === selectedPackage)?.description || 'No description available'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeItemTab === 'membership' && (
                  <div>
                    <div className="text-sm text-gray-700 mb-2">Membership</div>
                    <input className="w-72 border rounded px-2 py-1 text-sm" placeholder="Select membership" />
                  </div>
                )}
                {activeItemTab === 'prepaid' && (
                  <div className="grid grid-cols-12 gap-x-8 gap-y-3">
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Card Number</div>
                      <input value={prepaidCardNumber} onChange={(e)=>setPrepaidCardNumber(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Expiry Date</div>
                      <div className="flex items-center gap-2">
                        <input type="date" value={prepaidExpiryDate} onChange={(e)=>setPrepaidExpiryDate(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                        <span className="inline-flex h-8 w-8 items-center justify-center border rounded text-gray-600">🗓</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Price</div>
                      <input value={prepaidPrice} onChange={(e)=>setPrepaidPrice(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Expiry Days</div>
                      <input value={prepaidExpiryDays} onChange={(e)=>setPrepaidExpiryDays(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Notes</div>
                      <input value={prepaidNotes} onChange={(e)=>setPrepaidNotes(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                    </div>
                    <div className="col-span-6 flex items-end">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={prepaidOneTime} onChange={(e)=>setPrepaidOneTime(e.target.checked)} className="h-2 w-2 accent-blue-600" />
                        One time use
                      </label>
                    </div>
                  </div>
                )}
                {activeItemTab === 'gift' && (
                  <div className="grid grid-cols-12 gap-x-8 gap-y-4">
                    {/* Left column */}
                    <div className="col-span-6 space-y-3">
                      <div>
                        <div className="text-sm text-gray-700 mb-1">Card #</div>
                        <div className="flex items-center gap-2">
                          <input value={giftCardNumber} onChange={(e)=>setGiftCardNumber(e.target.value)} className="w-40 border rounded px-2 py-1 text-sm" />
                          <button className="text-blue-600 text-sm" title="Edit">✎</button>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-700 mb-1">Gift</div>
                        <div className="inline-flex rounded border overflow-hidden">
                          <button onClick={()=>{ setGiftType('amount'); }} className={`px-4 py-1 text-sm ${giftType==='amount' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>Amount</button>
                          <button onClick={()=>{ setGiftType('service'); setGiftServiceDialogOpen(true); }} className={`px-4 py-1 text-sm ${giftType==='service' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>Service</button>
                        </div>
                      </div>

                      {giftType === 'amount' && (
                        <div>
                          <div className="text-sm text-gray-700 mb-1">Price(₹)</div>
                          <input value={giftPrice} onChange={(e)=>setGiftPrice(e.target.value)} className="w-72 border rounded px-2 py-1 text-sm" />
                        </div>
                      )}

                      <div>
                        <button className="text-blue-600 text-sm" onClick={()=>setGiftNotesOpen((v)=>!v)}>+Notes</button>
                        {giftNotesOpen && (
                          <textarea value={giftNotes} onChange={(e)=>setGiftNotes(e.target.value)} className="mt-2 w-full border rounded px-2 py-1 text-sm" rows={2} />
                        )}
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="col-span-6 space-y-3">
                      <div>
                        <div className="text-sm text-gray-700 mb-1">Buying for</div>
                        <div className="inline-flex rounded border overflow-hidden">
                          <button onClick={()=>setGiftBuyingFor('self')} className={`px-4 py-1 text-sm ${giftBuyingFor==='self' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>Self</button>
                          <button onClick={()=>{ setGiftBuyingFor('others'); setGiftOthersDialogOpen(true); }} className={`px-4 py-1 text-sm ${giftBuyingFor==='others' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>Others</button>
                        </div>
                      </div>

                      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={giftEmailSend} onChange={(e)=>setGiftEmailSend(e.target.checked)} className="h-2 w-2 accent-blue-600" />
                        Send gift card by email
                      </label>

                      <div className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-4">
                          <div className="text-sm text-gray-700 mb-1">Expiry</div>
                          <select value={giftExpiryMode} onChange={(e)=>setGiftExpiryMode(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                            <option value="date">Date</option>
                          </select>
                        </div>
                        <div className="col-span-8">
                          <div className="text-sm text-gray-700 mb-1">&nbsp;</div>
                          <div className="flex items-center gap-2">
                            <input type="date" value={giftExpiryDate} onChange={(e)=>setGiftExpiryDate(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                            <span className="inline-flex h-8 w-8 items-center justify-center border rounded text-gray-600">🗓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeItemTab === 'service' && (
                  <div className="grid grid-cols-12 gap-x-8 gap-y-4 items-center">
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Service</div>
                      <select
                        value={svcName}
                        onChange={(e)=>{
                          const selectedName = e.target.value;
                          setSvcName(selectedName);
                          const svc = services.find(s => s.name === selectedName);
                          if (svc && typeof svc.price !== 'undefined') setSvcPrice(String(svc.price));
                        }}
                        className="w-72 border rounded px-2 py-1 text-sm bg-white"
                      >
                        <option value="">{servicesLoading ? 'Loading…' : 'Select service'}</option>
                        {services.map((s) => (
                          <option key={s.id || s.name} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Room</div>
                      <select value={svcRoom} onChange={(e)=>setSvcRoom(e.target.value)} className="w-56 border rounded px-2 py-1 text-sm bg-white">
                        <option value="">{roomsLoading ? 'Loading…' : 'Select room'}</option>
                        <option value="N/A">N/A</option>
                        {rooms.map((r) => (
                          <option key={r.id || r.code} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Quantity</div>
                      <input type="number" min={1} value={svcQty} onChange={(e)=>setSvcQty(Number(e.target.value))} className="w-28 border rounded px-2 py-1 text-sm" />
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Start</div>
                      <select value={svcStart} onChange={(e)=>setSvcStart(e.target.value)} className="w-40 border rounded px-2 py-1 text-sm">
                        {timeOptions.map(t => (<option key={t}>{t}</option>))}
                      </select>
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">Price</div>
                      <input value={svcPrice} onChange={(e)=>setSvcPrice(e.target.value)} className="w-40 border rounded px-2 py-1 text-sm" />
                    </div>
                    <div className="col-span-6">
                      <div className="text-sm text-gray-700 mb-1">End</div>
                      <select value={svcEnd} onChange={(e)=>setSvcEnd(e.target.value)} className="w-40 border rounded px-2 py-1 text-sm">
                        {timeOptions.map(t => (<option key={t}>{t}</option>))}
                      </select>
                    </div>
                  </div>
                )}
                {activeItemTab === 'product' && (
                  <ProductSalesTab />
                )}

                {/* Footer bar: Sale by + Add */}
                <div className="mt-6 -mx-4 border-t">
                  <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-700">Sale by</div>
                      <div className="relative">
                        <select value={saleBy} onChange={(e)=>setSaleBy(e.target.value)} className="appearance-none pr-8 border rounded px-3 py-2 text-sm bg-white">
                          <option>Koyyana Sai Mythree</option>
                          <option>John Doe</option>
                          <option>Jane Smith</option>
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">Add</button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right: Collect payment */}
          <div className="col-span-6 border rounded-md p-3">
            <div className="text-sm font-medium text-gray-800 mb-2">Collect Payment</div>
            
            {/* Invoice ID display */}
            <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Invoice No:</span> {invoiceNumber || invoiceId || 'Not created yet'}
                </div>
                {availableInvoices.length > 1 && (
                  <select 
                    value={invoiceId} 
                    onChange={(e) => setInvoiceId(e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    {availableInvoices.map((invId) => (
                      <option key={invId} value={invId}>
                        {invId}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {invoicesLoading && (
                <div className="text-xs text-blue-600 mt-1">Creating/getting invoice...</div>
              )}
              {invoiceId && !invoicesLoading && (
                <div className="text-xs text-green-600 mt-1">✓ Invoice ready for payment</div>
              )}
              {!invoiceId && guestFound && !invoicesLoading && (
                <div className="text-xs text-orange-600 mt-1">Invoice will be created automatically when you make payment</div>
              )}
              <div className="text-xs text-gray-600 mt-1">
                💡 Invoice will be automatically created if guest doesn't have one
              </div>
            </div>

            {/* Selected items summary */}
            {(selectedPackage || svcName || prepaidCardNumber || giftCardNumber) && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <div className="font-medium text-blue-800 mb-1">Selected Items:</div>
                <div className="space-y-1 text-blue-700">
                  {selectedPackage && (
                    <div>• Package: {selectedPackage} - ₹{packagePrice}</div>
                  )}
                  {svcName && (
                    <div>• Service: {svcName} (Qty: {svcQty}) - ₹{svcPrice}</div>
                  )}
                  {prepaidCardNumber && (
                    <div>• Prepaid Card: {prepaidCardNumber} - ₹{prepaidPrice}</div>
                  )}
                  {giftCardNumber && (
                    <div>• Gift Card: {giftCardNumber} - ₹{giftPrice}</div>
                  )}
                  <div className="font-medium text-blue-800 mt-2">Total: ₹{amount}</div>
                </div>
              </div>
            )}

            {/* Invoice warning */}
            {guestFound && !invoiceId && !invoicesLoading && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-300 text-blue-700 rounded text-sm">
                ℹ️ No invoice found for this guest. An invoice will be created automatically when you process payment.
              </div>
            )}

            {/* Payment status messages */}
            {paymentSuccess && (
              <div className="mb-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded text-sm">
                Payment submitted successfully!
              </div>
            )}
            {paymentError && (
              <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                {paymentError}
              </div>
            )}
            <div className="flex">
              <div className="w-40 border-r pr-3 space-y-2">
                {['cash','credit','check','custom','gift','points'].map((m)=> (
                  <button
                    key={m}
                    onClick={()=>setPaymentMethod(m)}
                    className={`w-full text-left px-3 py-2 rounded ${paymentMethod===m? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50'}`}
                  >
                    {m === 'cash' && 'Cash'}
                    {m === 'credit' && 'Credit/Debit'}
                    {m === 'check' && 'Check'}
                    {m === 'custom' && 'Custom'}
                    {m === 'gift' && 'Prepaid/Gift'}
                    {m === 'points' && 'Points'}
                  </button>
                ))}
              </div>
              <div className="flex-1 pl-4">
                {paymentMethod !== 'check' && paymentMethod !== 'credit' && (
                  <>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Amount</div>
                      <div className="col-span-5">
                        <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated from selected items</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Change:</div>
                      <div className="col-span-5 text-sm">0</div>
                    </div>
                    {paymentMethod==='custom' && (
                      <div className="grid grid-cols-12 gap-3 items-center mb-3">
                        <div className="col-span-3 text-sm text-gray-700">Payment Data</div>
                        <div className="col-span-9">
                          <select value={customPayment} onChange={(e)=>setCustomPayment(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                            <option value="">Select custom payment</option>
                            <option>UPI</option>
                            <option>Wallet</option>
                            <option>Bank transfer</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {paymentMethod === 'check' && (
                  <>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Check Number <span className="text-red-600">*</span></div>
                      <div className="col-span-5">
                        <input value={checkNumber} onChange={(e)=>setCheckNumber(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Amount</div>
                      <div className="col-span-5">
                        <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated from selected items</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Change:</div>
                      <div className="col-span-5 text-sm">0</div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Bank Name <span className="text-red-600">*</span></div>
                      <div className="col-span-5">
                        <input value={bankName} onChange={(e)=>setBankName(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-4">
                      <div className="col-span-3 text-sm text-gray-700">Check Date <span className="text-red-600">*</span></div>
                      <div className="col-span-5">
                        <div className="flex items-center gap-2">
                          <input type="date" value={checkDate} onChange={(e)=>setCheckDate(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                          <span className="inline-flex h-8 w-8 items-center justify-center border rounded text-gray-600">🗓</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'credit' && (
                  <>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Card Type</div>
                      <div className="col-span-5">
                        <select value={cardType} onChange={(e)=>setCardType(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                          <option>Debit Card</option>
                          <option>Credit Card</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Card # (last 4 digits)</div>
                      <div className="col-span-5">
                        <input value={cardLast4} onChange={(e)=>setCardLast4(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Amount</div>
                      <div className="col-span-5">
                        <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated from selected items</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Change:</div>
                      <div className="col-span-5 text-sm">0</div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Bank Name</div>
                      <div className="col-span-5">
                        <input value={cardBankName} onChange={(e)=>setCardBankName(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Terminal</div>
                      <div className="col-span-5">
                        <select value={terminal} onChange={(e)=>setTerminal(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                          <option value="">Select a terminal</option>
                          <option>Terminal 1</option>
                          <option>Terminal 2</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Receipt #</div>
                      <div className="col-span-5">
                        <input value={receiptNumber} onChange={(e)=>setReceiptNumber(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-4">
                      <div className="col-span-3 text-sm text-gray-700">Expiry</div>
                      <div className="col-span-5">
                        <div className="flex items-center gap-2">
                          <input type="date" value={cardExpiry} onChange={(e)=>setCardExpiry(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
                          <span className="inline-flex h-8 w-8 items-center justify-center border rounded text-gray-600">🗓</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === 'gift' && (
                  <>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Card #</div>
                      <div className="col-span-5">
                        <input value={prepaidGiftCardNumber} onChange={(e)=>setPrepaidGiftCardNumber(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Amount</div>
                      <div className="col-span-5">
                        <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated from selected items</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-4">
                      <div className="col-span-3 text-sm text-gray-700">Change:</div>
                      <div className="col-span-5 text-sm">0</div>
                    </div>
                  </>
                )}

                {paymentMethod === 'points' && (
                  <>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Loyalty Program</div>
                      <div className="col-span-5">
                        <select value={loyaltyProgram} onChange={(e)=>setLoyaltyProgram(e.target.value)} className="w-full border rounded px-2 py-1 text-sm">
                          <option value="">Select program</option>
                          <option>Default Program</option>
                          <option>VIP Program</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Amount</div>
                      <div className="col-span-5">
                        <input value={loyaltyAmount} onChange={(e)=>setLoyaltyAmount(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-3">
                      <div className="col-span-3 text-sm text-gray-700">Change:</div>
                      <div className="col-span-5 text-sm">0</div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 items-center mb-4">
                      <div className="col-span-3 text-sm text-gray-700">Points</div>
                      <div className="col-span-5">
                        <input value={loyaltyPoints} onChange={(e)=>setLoyaltyPoints(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
                      </div>
                    </div>
                  </>
                )}

                <button 
                  onClick={submitPayment}
                  disabled={paymentLoading}
                  className={`px-4 py-2 rounded text-sm ${
                    paymentLoading 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {paymentLoading ? 'Processing...' : 'Add Payment'}
                </button>
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={clearForm}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Clear Form
                  </button>
                  <button 
                    onClick={printInvoice}
                    disabled={printLoading || !invoiceId}
                    className={`h-8 w-8 border rounded ${
                      printLoading || !invoiceId 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-50'
                    }`}
                    title={printLoading ? 'Downloading...' : 'Print Invoice'}
                  >
                    {printLoading ? '⏳' : '🖨'}
                  </button>
                  <button className="h-8 w-8 border rounded">✉</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    {giftServiceDialogOpen && (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={()=>setGiftServiceDialogOpen(false)} />
        <div className="absolute inset-4 md:inset-10 bg-white rounded shadow-lg overflow-hidden flex flex-col">
          <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Add Service/Package To Gift Card</div>
            <button className="text-white/90" onClick={()=>setGiftServiceDialogOpen(false)}>✕</button>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <input className="flex-1 border rounded px-3 py-2" placeholder="Search Service name" />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded bg-blue-600 text-white text-sm">+ Service</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white text-sm">+ Day Package</button>
            </div>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-12 text-sm text-gray-700 border-b py-2">
              <div className="col-span-4 font-medium">ITEM</div>
              <div className="col-span-3 font-medium">Type</div>
              <div className="col-span-2 font-medium">Price</div>
              <div className="col-span-1 font-medium">Qty</div>
              <div className="col-span-2 font-medium">Final Price</div>
            </div>
            <div className="h-[50vh] md:h-[55vh] overflow-auto">
              {/* rows will go here */}
            </div>
          </div>
          <div className="mt-auto px-4 py-3 flex items-center justify-end gap-3">
            <button className="px-4 py-2 text-blue-700" onClick={()=>setGiftServiceDialogOpen(false)}>Cancel</button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white">Add to GiftCard</button>
          </div>
        </div>
      </div>
    )}
    {giftOthersDialogOpen && (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={()=>setGiftOthersDialogOpen(false)} />
        <div className="absolute inset-4 md:inset-28 bg-white rounded shadow-lg overflow-hidden flex flex-col">
          <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="font-semibold">Buying For Others</div>
            <button className="text-white/90" onClick={()=>setGiftOthersDialogOpen(false)}>✕</button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-2 text-sm text-gray-700">Recipient</div>
              <div className="col-span-7">
                <input value={recipientName} onChange={(e)=>setRecipientName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Search or enter recipient name" />
              </div>
              <div className="col-span-1 text-center text-gray-500">or</div>
              <div className="col-span-2 flex justify-end">
                <button className="px-4 py-2 rounded bg-blue-600 text-white text-sm" onClick={()=>setNewGuestOpen(true)}>+ New Guest</button>
              </div>
            </div>
          </div>
          <div className="mt-auto px-6 py-4 flex items-center justify-end gap-3">
            <button className="px-4 py-2 text-blue-700" onClick={()=>setGiftOthersDialogOpen(false)}>Cancel</button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={()=>setGiftOthersDialogOpen(false)}>Save</button>
          </div>
        </div>
      </div>
    )}
    <NewGuestModal
      open={newGuestOpen}
      onClose={()=>setNewGuestOpen(false)}
      onGuestCreated={(guest)=>{
        const name = `${guest?.first_name || guest?.firstName || ''} ${guest?.last_name || guest?.lastName || ''}`.trim();
        setRecipientName(name || recipientName);
        setNewGuestOpen(false);
      }}
      selectedCenter={null}
    />

    {/* Payment Screen Modal */}
    {showPaymentScreen && currentPayment && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Payment Confirmation</h2>
            <button 
              onClick={() => setShowPaymentScreen(false)}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tax Receipt Banner */}
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="text-sm text-blue-800">
              <strong>Tax receipt voucher no./Advance receipt no.</strong> has been generated for this bill. 
              Redemption from an instrument sold before July 1, 2017 will not generate GST sequences for the bill.
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Left Panel - Invoice Details */}
            <div className="w-1/2 p-6 border-r">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Center Name: {centerName}</div>
                <div className="text-lg font-semibold">Invoice No {currentPayment.invoiceNumber || currentPayment.invoiceId || currentPayment.id}</div>
                <div className="text-sm text-gray-600">
                  | {currentPayment.guest.name} | {currentPayment.guest.email} | {currentPayment.guest.phone}
                </div>
              </div>

              {/* Item Details Table */}
              <div className="mb-6">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium border-b pb-2 mb-2">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2">Qty</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Discount</div>
                  <div className="col-span-2">Final Price</div>
                </div>
                
                {/* Display selected items */}
                {currentPayment.items.package && (
                  <div className="grid grid-cols-12 gap-2 text-sm py-2 border-b">
                    <div className="col-span-4">{currentPayment.items.package}</div>
                    <div className="col-span-2">1</div>
                    <div className="col-span-2">₹{packagePrice}</div>
                    <div className="col-span-2">0.00</div>
                    <div className="col-span-2">₹{packagePrice}</div>
                  </div>
                )}
                
                {currentPayment.items.service && (
                  <div className="grid grid-cols-12 gap-2 text-sm py-2 border-b">
                    <div className="col-span-4">{currentPayment.items.service}</div>
                    <div className="col-span-2">{svcQty}</div>
                    <div className="col-span-2">₹{svcPrice}</div>
                    <div className="col-span-2">0.00</div>
                    <div className="col-span-2">₹{(parseFloat(svcPrice) * svcQty).toFixed(2)}</div>
                  </div>
                )}

                {currentPayment.items.prepaid && (
                  <div className="grid grid-cols-12 gap-2 text-sm py-2 border-b">
                    <div className="col-span-4">Prepaid Card: {currentPayment.items.prepaid}</div>
                    <div className="col-span-2">1</div>
                    <div className="col-span-2">₹{prepaidPrice}</div>
                    <div className="col-span-2">0.00</div>
                    <div className="col-span-2">₹{prepaidPrice}</div>
                  </div>
                )}

                {currentPayment.items.gift && (
                  <div className="grid grid-cols-12 gap-2 text-sm py-2 border-b">
                    <div className="col-span-4">Gift Card: {currentPayment.items.gift}</div>
                    <div className="col-span-2">1</div>
                    <div className="col-span-2">₹{giftPrice}</div>
                    <div className="col-span-2">0.00</div>
                    <div className="col-span-2">₹{giftPrice}</div>
                  </div>
                )}

                {/* Summary */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Net Price:</span>
                    <span>₹{currentPayment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t pt-2">
                    <span>Sum Total:</span>
                    <span>₹{currentPayment.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                Sale By: {saleBy}
              </div>
            </div>

            {/* Right Panel - Payment Details */}
            <div className="w-1/2 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Collect Payment</h3>
                
                {/* Payment Method List */}
                <div className="flex mb-6">
                  <div className="w-40 border-r pr-3 space-y-2">
                    {['cash','credit','check','custom','gift','points'].map((m)=> (
                      <button
                        key={m}
                        className={`w-full text-left px-3 py-2 rounded text-sm ${
                          currentPayment.method === m 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {m === 'cash' && 'Cash'}
                        {m === 'credit' && 'Credit/Debit'}
                        {m === 'check' && 'Check'}
                        {m === 'custom' && 'Custom'}
                        {m === 'gift' && 'Prepaid/Gift'}
                        {m === 'points' && 'Points'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex-1 pl-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Amount:</span>
                        <span className="text-sm">₹{currentPayment.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Change:</span>
                        <span className="text-sm">₹0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Payment Data:</span>
                        <span className="text-sm">{currentPayment.method.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded text-sm">
                        Add Payment
                      </button>
                      <button 
                        onClick={printInvoice}
                        disabled={printLoading || !invoiceId}
                        className={`w-full px-4 py-2 border border-gray-300 rounded text-sm ${
                          printLoading || !invoiceId 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {printLoading ? 'Downloading...' : 'Print'}
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Close
                      </button>
                    </div>
                    
                    <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded text-sm font-medium">
                      Close Invoice
                    </button>
                  </div>
                </div>
              </div>

              {/* Outstanding Balance */}
              <div className="mb-6 p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center text-sm">
                  <span>₹1,000.00 Outstanding:</span>
                  <span className="font-semibold">₹{outstandingBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Pay Now</button>
                </div>
                <div className="mt-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View and send package agreement</button>
                </div>
              </div>

              {/* Payment History */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3">Payment History</h4>
                <div className="border rounded">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium border-b bg-gray-50 p-2">
                    <div className="col-span-4">Type</div>
                    <div className="col-span-3">Amount</div>
                    <div className="col-span-5">Date</div>
                  </div>
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 text-xs p-2 border-b">
                      <div className="col-span-4">
                        {payment.method === 'custom' ? `Custom Name: ${customPayment || 'Card'}` : 
                         payment.method === 'credit' ? 'Credit/Debit Card' : 
                         payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                      </div>
                      <div className="col-span-3">₹{payment.amount.toFixed(2)}</div>
                      <div className="col-span-5">{payment.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex space-x-6">
              {['Package', 'Membership', 'Prepaid Card', 'Gift Card'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    tab === 'Package' 
                      ? 'border-blue-600 text-blue-700' 
                      : 'border-transparent text-gray-600 hover:text-blue-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <label className="block text-sm text-gray-700 mb-1">Package</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Select package" />
              </div>
              <div className="col-span-6">
                <label className="block text-sm text-gray-700 mb-1">Price</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Enter price" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );

}

function ProductSalesTab() {
  // Mock product data
  const products = [
    {
      id: 'p1',
      name: 'Vitamin C Serum',
      price: 1200,
      stock: 15,
    },
    {
      id: 'p2',
      name: 'Aloe Vera Gel',
      price: 800,
      stock: 30,
    },
    {
      id: 'p3',
      name: 'Sunscreen SPF 50',
      price: 950,
      stock: 20,
    },
    {
      id: 'p4',
      name: 'Hair Shampoo',
      price: 450,
      stock: 25,
    },
    {
      id: 'p5',
      name: 'Face Cream',
      price: 750,
      stock: 18,
    },
    {
      id: 'p6',
      name: 'Body Lotion',
      price: 650,
      stock: 22,
    },
  ];
  
  const [selectedProductId, setSelectedProductId] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [customPrice, setCustomPrice] = React.useState('');
  const [cart, setCart] = React.useState([]);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Add product to cart
  const addToCart = () => {
    if (!selectedProduct || quantity < 1) return;
    
    const price = customPrice ? parseFloat(customPrice) : selectedProduct.price;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === selectedProduct.id);
      if (existing) {
        return prev.map(item => 
          item.id === selectedProduct.id 
            ? { ...item, quantity: item.quantity + quantity, price: price } 
            : item
        );
      }
      return [...prev, { ...selectedProduct, quantity, price }];
    });
    
    setSelectedProductId('');
    setQuantity(1);
    setCustomPrice('');
  };

  // Remove product from cart
  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  // Update cart quantity
  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <div className="mb-4">
        <div className="text-lg font-semibold text-blue-900 mb-4">Product Sales</div>
        
        {/* Product Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a product...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ₹{product.price} (Stock: {product.stock})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock || 0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Price (optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder={selectedProduct ? `Default: ₹${selectedProduct.price}` : ''}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={addToCart}
            disabled={!selectedProductId || quantity < 1}
            className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <div className="text-md font-semibold mb-3 text-gray-900">Selected Products</div>
          <table className="min-w-full text-sm mb-4">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="px-2 py-2">Product</th>
                <th className="px-2 py-2">Qty</th>
                <th className="px-2 py-2">Price</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="px-2 py-2">{item.name}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 text-xs"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-2">₹{item.price}</td>
                  <td className="px-2 py-2">₹{item.price * item.quantity}</td>
                  <td className="px-2 py-2">
                    <button 
                      className="text-red-600 hover:underline text-xs" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-semibold text-blue-900 text-lg border-t pt-2">
            Total: ₹{total}
          </div>
        </div>
      )}
    </div>
  );
}