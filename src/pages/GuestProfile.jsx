import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Tabs } from '../components/GuestProfileTabs/Tabs.jsx';
import GeneralTab from '../components/GuestProfileTabs/General.jsx';
import NotesTab from '../components/GuestProfileTabs/Notes.jsx';
import AppointmentsTab from '../components/GuestProfileTabs/Appointments.jsx';
import ProductsTab from '../components/GuestProfileTabs/Products.jsx';
import ReferralHistoryTab from '../components/GuestProfileTabs/ReferralHistory.jsx';
import PackagesTab from '../components/GuestProfileTabs/Packages.jsx';
import PrepaidCardsTab from '../components/GuestProfileTabs/PrepaidCards.jsx';
import GiftCardsTab from '../components/GuestProfileTabs/GiftCards.jsx';
import IssuesTab from '../components/GuestProfileTabs/Issues.jsx';
import PointsTab from '../components/GuestProfileTabs/Points.jsx';
import OpenTab from '../components/GuestProfileTabs/Open.jsx';
import PaymentsTab from '../components/GuestProfileTabs/Payments.jsx';
import NotificationsTab from '../components/GuestProfileTabs/Notifications.jsx';
import FormsUnifiedViewTab from '../components/GuestProfileTabs/FormsUnifiedView.jsx';
import GalleryTab from '../components/GuestProfileTabs/Gallery.jsx';
import OpportunitiesTab from '../components/GuestProfileTabs/Opportunities.jsx';

export default function GuestProfile() {
  const { guestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guest, setGuest] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!guestId) {
          setError('Missing guest id');
          setLoading(false);
          return;
        }
        const res = await fetch(`http://127.0.0.1:8000/guests/${encodeURIComponent(guestId)}`, {
          headers: { accept: 'application/json' }
        });
        if (!res.ok) {
          // Fallback to passed state if available
          if (location.state && location.state.guestFallback) {
            setGuest(location.state.guestFallback);
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
        } else {
          const data = await res.json();
          setGuest(data);
        }
      } catch (e) {
        console.error('Failed to load guest', e);
        if (location.state && location.state.guestFallback) {
          setGuest(location.state.guestFallback);
          setError(null);
        } else {
          setError('Failed to load guest');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [guestId, location.state]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Guest Profile</h1>
          <button className="px-3 py-2 text-sm border rounded" onClick={() => navigate(-1)}>Back</button>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading…</div>
        ) : error ? (
          <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded">{error}</div>
        ) : guest ? (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold select-none">
                {(guest.first_name?.[0] || 'G')}{(guest.last_name?.[0] || '')}
              </div>
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-900">{`${guest.first_name || ''} ${guest.last_name || ''}`.trim() || 'Guest'}</div>
                <div className="text-sm text-gray-600 mt-0.5">{guest.phone_no || ''}</div>
              </div>
            </div>
            <Tabs
              tabs={[
                { key: 'general', label: 'General', content: <GeneralTab guest={guest} /> },
                { key: 'notes', label: 'Notes', content: <NotesTab guestId={guestId} /> },
                { key: 'appointments', label: 'Appointments', content: <AppointmentsTab guestId={guestId} /> },
                { key: 'products', label: 'Products', content: <ProductsTab guestId={guestId} /> },
                { key: 'referrals', label: 'Referral History', content: <ReferralHistoryTab guestId={guestId} /> },
                { key: 'packages', label: 'Packages', content: <PackagesTab guestId={guestId} /> },
                { key: 'prepaid', label: 'Prepaid Cards', content: <PrepaidCardsTab guestId={guestId} /> },
                { key: 'giftcards', label: 'Gift Cards', content: <GiftCardsTab guestId={guestId} /> },
                { key: 'issues', label: 'Issues', content: <IssuesTab guestId={guestId} /> },
                { key: 'points', label: 'Points', content: <PointsTab guestId={guestId} /> },
                { key: 'open', label: 'Open', content: <OpenTab /> },
                { key: 'payments', label: 'Payments', content: <PaymentsTab guestId={guestId} /> },
                { key: 'notifications', label: 'Notifications', content: <NotificationsTab guestId={guestId} /> },
                { key: 'forms', label: 'Forms Unified View', content: <FormsUnifiedViewTab /> },
                { key: 'gallery', label: 'Gallery', content: <GalleryTab /> },
                { key: 'opportunities', label: 'Opportunities', content: <OpportunitiesTab /> },
              ]}
              activeKey={activeTab}
              onChange={setActiveTab}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}


