import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Database,
  Server,
  Globe,
  DollarSign,
  FileText,
  Save,
  RefreshCw,
  Download,
  Upload,
  Lock,
  Users,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Copy,
  Edit,
  Trash2
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('platform');
  const [showApiKey, setShowApiKey] = useState<{[key: string]: boolean}>({});
  const [settings, setSettings] = useState({
    platform: {
      siteName: 'KrishiBondhu',
      siteDescription: 'Connecting farmers with markets through technology',
      supportEmail: 'support@krishibondhu.com',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true
    },
    api: {
      openWeatherKey: 'c2baa30284cc15344505b3b6814a519c',
      openRouterKey: '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',
      mapTilerKey: 'EGKhKFjSRmmr2eGJgWeS',
      rateLimit: 1000,
      keyRotationEnabled: true
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      orderUpdates: true,
      marketingEmails: false,
      systemAlerts: true
    },
    pricing: {
      farmerCommission: 2.5,
      customerServiceFee: 1.5,
      deliveryCommission: 8.0,
      warehouseStorageFee: 250,
      minimumOrderValue: 500
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      maxLoginAttempts: 5,
      ipWhitelistEnabled: false
    },
    backup: {
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      lastBackup: '2024-01-15T08:00:00Z'
    }
  });

  const apiKeys = [
    { name: 'OpenWeather API', key: 'openWeatherKey', service: 'Weather Data', status: 'active' },
    { name: 'OpenRouter AI', key: 'openRouterKey', service: 'AI Assistant', status: 'active' },
    { name: 'MapTiler API', key: 'mapTilerKey', service: 'Maps & Location', status: 'active' }
  ];

  const notificationTemplates = [
    { id: 'order_confirmed', name: 'Order Confirmation', type: 'Email/SMS', status: 'active' },
    { id: 'order_delivered', name: 'Order Delivered', type: 'Email/SMS', status: 'active' },
    { id: 'payment_received', name: 'Payment Received', type: 'Email', status: 'active' },
    { id: 'weather_alert', name: 'Weather Alert', type: 'Push/SMS', status: 'active' },
    { id: 'price_update', name: 'Price Update', type: 'Email', status: 'active' }
  ];

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = (section: string) => {
    console.log(`Saving ${section} settings:`, settings[section as keyof typeof settings]);
    // Here you would save settings to your backend
    alert(`${section} settings saved successfully!`);
  };

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleBackupNow = () => {
    console.log('Creating backup...');
    alert('Backup initiated successfully!');
  };

  const handleRestoreBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sql,.json,.zip';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Restoring from backup:', file.name);
        alert(`Restoring from ${file.name}...`);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
          <p className="text-slate-400">Configure platform settings, security, and integrations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Download className="mr-2 h-4 w-4" />
            Export Config
          </Button>
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
            <Upload className="mr-2 h-4 w-4" />
            Import Config
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-slate-800">
          <TabsTrigger value="platform" className="data-[state=active]:bg-slate-700">
            Platform
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-slate-700">
            API Keys
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-slate-700">
            Pricing
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-slate-700">
            Security
          </TabsTrigger>
          <TabsTrigger value="backup" className="data-[state=active]:bg-slate-700">
            Backup
          </TabsTrigger>
        </TabsList>

        {/* Platform Configuration */}
        <TabsContent value="platform">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="mr-2 h-5 w-5 text-blue-400" />
                Platform Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Site Name</Label>
                  <Input 
                    value={settings.platform.siteName}
                    onChange={(e) => handleSettingChange('platform', 'siteName', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Support Email</Label>
                  <Input 
                    value={settings.platform.supportEmail}
                    onChange={(e) => handleSettingChange('platform', 'supportEmail', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Site Description</Label>
                <Textarea 
                  value={settings.platform.siteDescription}
                  onChange={(e) => handleSettingChange('platform', 'siteDescription', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Platform Features</h3>
                
                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Maintenance Mode</p>
                    <p className="text-sm text-slate-400">Enable to take the platform offline for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.platform.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('platform', 'maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">User Registration</p>
                    <p className="text-sm text-slate-400">Allow new users to register on the platform</p>
                  </div>
                  <Switch
                    checked={settings.platform.registrationEnabled}
                    onCheckedChange={(checked) => handleSettingChange('platform', 'registrationEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email Verification</p>
                    <p className="text-sm text-slate-400">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    checked={settings.platform.emailVerificationRequired}
                    onCheckedChange={(checked) => handleSettingChange('platform', 'emailVerificationRequired', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('platform')} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Save Platform Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Management */}
        <TabsContent value="api">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="mr-2 h-5 w-5 text-yellow-400" />
                API Key Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {apiKeys.map((api, index) => (
                  <div key={index} className="p-4 border border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white">{api.name}</h4>
                        <p className="text-sm text-slate-400">{api.service}</p>
                      </div>
                      <Badge className="bg-green-900/20 text-green-400 border-green-400/20">
                        {api.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Input 
                        type={showApiKey[api.key] ? 'text' : 'password'}
                        value={settings.api[api.key as keyof typeof settings.api] as string}
                        onChange={(e) => handleSettingChange('api', api.key, e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleApiKeyVisibility(api.key)}
                        className="border-slate-700"
                      >
                        {showApiKey[api.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(settings.api[api.key as keyof typeof settings.api] as string)}
                        className="border-slate-700"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">API Rate Limit (requests/hour)</Label>
                  <Input 
                    type="number"
                    value={settings.api.rateLimit}
                    onChange={(e) => handleSettingChange('api', 'rateLimit', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Auto Key Rotation</p>
                    <p className="text-sm text-slate-400">Automatically rotate API keys monthly</p>
                  </div>
                  <Switch
                    checked={settings.api.keyRotationEnabled}
                    onCheckedChange={(checked) => handleSettingChange('api', 'keyRotationEnabled', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('api')} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-purple-400" />
                  Notification Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-slate-400">Send notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.emailEnabled}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'emailEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-medium text-white">SMS Notifications</p>
                      <p className="text-sm text-slate-400">Send notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.smsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'smsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="font-medium text-white">Push Notifications</p>
                      <p className="text-sm text-slate-400">Send push notifications to mobile apps</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.notifications.pushEnabled}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'pushEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Notification Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Order Updates</span>
                  <Switch
                    checked={settings.notifications.orderUpdates}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'orderUpdates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Marketing Emails</span>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'marketingEmails', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">System Alerts</span>
                  <Switch
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'systemAlerts', checked)}
                  />
                </div>

                <Button onClick={() => handleSaveSettings('notifications')} className="w-full bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-800 bg-slate-900 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationTemplates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{template.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{template.type}</Badge>
                        <Badge className="bg-green-900/20 text-green-400 text-xs">{template.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Configuration */}
        <TabsContent value="pricing">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-400" />
                Pricing & Commission Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Farmer Commission (%)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={settings.pricing.farmerCommission}
                    onChange={(e) => handleSettingChange('pricing', 'farmerCommission', parseFloat(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400">Commission charged from farmers per transaction</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Customer Service Fee (%)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={settings.pricing.customerServiceFee}
                    onChange={(e) => handleSettingChange('pricing', 'customerServiceFee', parseFloat(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400">Service fee charged to customers</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Delivery Commission (%)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={settings.pricing.deliveryCommission}
                    onChange={(e) => handleSettingChange('pricing', 'deliveryCommission', parseFloat(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400">Commission for delivery partners</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Warehouse Storage Fee (৳/ton/month)</Label>
                  <Input 
                    type="number"
                    value={settings.pricing.warehouseStorageFee}
                    onChange={(e) => handleSettingChange('pricing', 'warehouseStorageFee', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400">Monthly storage fee per ton</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Minimum Order Value (৳)</Label>
                  <Input 
                    type="number"
                    value={settings.pricing.minimumOrderValue}
                    onChange={(e) => handleSettingChange('pricing', 'minimumOrderValue', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-400">Minimum order value required for transactions</p>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('pricing')} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Save Pricing Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-5 w-5 text-red-400" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Session Timeout (minutes)</Label>
                  <Input 
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Password Minimum Length</Label>
                  <Input 
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Max Login Attempts</Label>
                  <Input 
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-400">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">IP Whitelist</p>
                    <p className="text-sm text-slate-400">Restrict admin access to specific IP addresses</p>
                  </div>
                  <Switch
                    checked={settings.security.ipWhitelistEnabled}
                    onCheckedChange={(checked) => handleSettingChange('security', 'ipWhitelistEnabled', checked)}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('security')} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Recovery */}
        <TabsContent value="backup">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="mr-2 h-5 w-5 text-cyan-400" />
                  Backup Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Auto Backup</p>
                    <p className="text-sm text-slate-400">Automatically backup data</p>
                  </div>
                  <Switch
                    checked={settings.backup.autoBackupEnabled}
                    onCheckedChange={(checked) => handleSettingChange('backup', 'autoBackupEnabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Backup Frequency</Label>
                  <Select 
                    value={settings.backup.backupFrequency} 
                    onValueChange={(value) => handleSettingChange('backup', 'backupFrequency', value)}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Retention Period (days)</Label>
                  <Input 
                    type="number"
                    value={settings.backup.retentionDays}
                    onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-sm font-medium text-slate-300">Last Backup</p>
                  <p className="text-sm text-slate-400">
                    {new Date(settings.backup.lastBackup).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Backup Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleBackupNow}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Create Backup Now
                </Button>

                <Button 
                  onClick={handleRestoreBackup}
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Restore from Backup
                </Button>

                <div className="p-3 border border-yellow-600/20 bg-yellow-900/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <p className="text-sm font-medium text-yellow-400">Warning</p>
                  </div>
                  <p className="text-xs text-slate-300">
                    Restoring from backup will overwrite all current data. Make sure to create a backup before proceeding.
                  </p>
                </div>

                <Button onClick={() => handleSaveSettings('backup')} className="w-full bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Backup Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;