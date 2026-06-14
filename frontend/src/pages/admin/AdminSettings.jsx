import { useState } from 'react';
import { Save, Store, Bell, Shield, Truck } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/common/Toast';

const AdminSettings = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    storeName: 'PureCoco',
    storeEmail: 'hello@purecoco.in',
    storePhone: '+91 98765 43210',
    freeShippingThreshold: '999',
    currency: 'INR',
    notifyNewOrders: true,
    notifyLowStock: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('purecoco_settings', JSON.stringify(settings));
    addToast('Settings saved successfully', 'success');
  };

  const sections = [
    { icon: Store, title: 'Store Information', fields: ['storeName', 'storeEmail', 'storePhone'] },
    { icon: Truck, title: 'Shipping', fields: ['freeShippingThreshold', 'currency'] },
  ];

  const labels = {
    storeName: 'Store Name',
    storeEmail: 'Contact Email',
    storePhone: 'Phone Number',
    freeShippingThreshold: 'Free Shipping Above (₹)',
    currency: 'Currency',
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure your store preferences">
      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {sections.map(({ icon: Icon, title, fields }) => (
          <div key={title} className="p-6 card">
            <h2 className="font-display text-lg font-semibold text-body mb-4 flex items-center gap-2">
              <Icon size={20} className="text-gold" /> {title}
            </h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <Input
                  key={field}
                  label={labels[field]}
                  value={settings[field]}
                  onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="p-6 card">
          <h2 className="font-display text-lg font-semibold text-body mb-4 flex items-center gap-2">
            <Bell size={20} className="text-gold" /> Notifications
          </h2>
          <div className="space-y-3">
            {[
              { key: 'notifyNewOrders', label: 'Email on new orders' },
              { key: 'notifyLowStock', label: 'Alert when stock is low' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-coconut/20 text-gold focus:ring-gold"
                />
                <span className="text-sm font-sans text-body">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 card">
          <h2 className="font-display text-lg font-semibold text-body mb-2 flex items-center gap-2">
            <Shield size={20} className="text-natural" /> Security
          </h2>
          <p className="text-sm text-muted font-sans mb-4">Admin access is protected by JWT authentication.</p>
          <Button type="button" variant="outline" onClick={() => addToast('Password change requires backend', 'info')}>
            Change Admin Password
          </Button>
        </div>

        <Button type="submit" variant="secondary" icon={Save} size="lg">
          Save Settings
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
