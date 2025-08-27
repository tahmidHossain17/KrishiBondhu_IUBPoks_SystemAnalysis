import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Megaphone,
  Users,
  Gift,
  Mail,
  MessageSquare,
  TrendingUp,
  Target,
  Calendar,
  Star,
  Send,
  Plus,
  Edit,
  Eye,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  Smartphone,
  DollarSign
} from 'lucide-react';

const MarketingTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  // Mock marketing campaigns data
  const campaigns = [
    {
      id: 'CAMP001',
      name: 'Winter Harvest Special',
      type: 'Promotional',
      status: 'active',
      audience: 'Farmers',
      reach: 12500,
      engagement: 8.7,
      budget: 25000,
      spent: 18750,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      channels: ['email', 'sms', 'social'],
      description: 'Promote winter crop varieties and special pricing for early adopters.'
    },
    {
      id: 'CAMP002',
      name: 'Customer Loyalty Program',
      type: 'Retention',
      status: 'active',
      audience: 'Customers',
      reach: 8900,
      engagement: 12.4,
      budget: 40000,
      spent: 22000,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      channels: ['email', 'app'],
      description: 'Reward frequent customers with points and exclusive offers.'
    },
    {
      id: 'CAMP003',
      name: 'New Warehouse Partner Drive',
      type: 'Acquisition',
      status: 'paused',
      audience: 'Warehouses',
      reach: 450,
      engagement: 6.2,
      budget: 15000,
      spent: 8500,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      channels: ['linkedin', 'email'],
      description: 'Attract new warehouse partners with onboarding incentives.'
    }
  ];

  // Mock farmer incentive programs
  const farmerPrograms = [
    {
      id: 'FIP001',
      name: 'Early Adopter Bonus',
      type: 'Cashback',
      amount: 500,
      participants: 1250,
      status: 'active',
      condition: 'First 5 orders',
      validity: '2024-03-31'
    },
    {
      id: 'FIP002',
      name: 'Quality Premium',
      type: 'Price Boost',
      amount: 10,
      participants: 890,
      status: 'active',
      condition: 'Grade A products',
      validity: '2024-12-31'
    },
    {
      id: 'FIP003',
      name: 'Referral Rewards',
      type: 'Commission',
      amount: 200,
      participants: 340,
      status: 'active',
      condition: 'Per successful referral',
      validity: 'Ongoing'
    }
  ];

  // Mock customer loyalty data
  const loyaltyProgram = {
    totalMembers: 5680,
    pointsIssued: 2450000,
    pointsRedeemed: 1890000,
    tiers: [
      { name: 'Bronze', members: 3200, minPoints: 0 },
      { name: 'Silver', members: 1800, minPoints: 1000 },
      { name: 'Gold', members: 580, minPoints: 5000 },
      { name: 'Platinum', members: 100, minPoints: 15000 }
    ]
  };

  // Mock email campaigns
  const emailCampaigns = [
    {
      id: 'EMAIL001',
      subject: 'New Season, New Opportunities!',
      recipients: 12000,
      openRate: 24.5,
      clickRate: 4.8,
      sentDate: '2024-01-15',
      status: 'completed'
    },
    {
      id: 'EMAIL002',
      subject: 'Weekly Market Price Update',
      recipients: 8500,
      openRate: 32.1,
      clickRate: 7.2,
      sentDate: '2024-01-14',
      status: 'completed'
    },
    {
      id: 'EMAIL003',
      subject: 'Weather Alert & Crop Protection Tips',
      recipients: 15000,
      openRate: 28.7,
      clickRate: 6.1,
      sentDate: '2024-01-13',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/20 text-green-400 border-green-400/20';
      case 'paused': return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/20';
      case 'completed': return 'bg-blue-900/20 text-blue-400 border-blue-400/20';
      case 'draft': return 'bg-slate-900/20 text-slate-400 border-slate-400/20';
      default: return 'bg-slate-900/20 text-slate-400 border-slate-400/20';
    }
  };

  const handleCreateCampaign = () => {
    console.log('Creating new campaign...');
    setIsCreateCampaignOpen(false);
  };

  const handleCampaignAction = (campaignId: string, action: string) => {
    console.log(`${action} campaign: ${campaignId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Marketing Tools</h1>
          <p className="text-slate-400">Manage campaigns, incentives, and customer engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={() => setIsCreateCampaignOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Marketing Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-slate-700">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="farmer-incentives" className="data-[state=active]:bg-slate-700">
            Farmer Programs
          </TabsTrigger>
          <TabsTrigger value="customer-loyalty" className="data-[state=active]:bg-slate-700">
            Customer Loyalty
          </TabsTrigger>
          <TabsTrigger value="email-marketing" className="data-[state=active]:bg-slate-700">
            Email Marketing
          </TabsTrigger>
          <TabsTrigger value="social-media" className="data-[state=active]:bg-slate-700">
            Social Media
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Megaphone className="mr-2 h-5 w-5 text-blue-400" />
                Marketing Campaigns ({campaigns.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Campaign</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Audience</TableHead>
                    <TableHead className="text-slate-300">Performance</TableHead>
                    <TableHead className="text-slate-300">Budget</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{campaign.name}</p>
                          <p className="text-sm text-slate-400">{campaign.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-slate-300">
                          {campaign.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-slate-300">
                          <Users className="h-4 w-4 mr-2 text-blue-400" />
                          {campaign.audience}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-white">{campaign.reach.toLocaleString()} reach</div>
                          <div className="text-slate-400">{campaign.engagement}% engagement</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-white">₹{(campaign.spent / 1000).toFixed(0)}K / ₹{(campaign.budget / 1000).toFixed(0)}K</div>
                          <div className="w-16 h-1 bg-slate-700 rounded-full mt-1">
                            <div 
                              className="h-1 bg-blue-400 rounded-full" 
                              style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCampaign(campaign)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCampaignAction(campaign.id, campaign.status === 'active' ? 'pause' : 'resume')}
                          >
                            {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farmer Incentives Tab */}
        <TabsContent value="farmer-incentives">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Gift className="mr-2 h-5 w-5 text-green-400" />
                Farmer Incentive Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Program</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Incentive</TableHead>
                    <TableHead className="text-slate-300">Participants</TableHead>
                    <TableHead className="text-slate-300">Condition</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmerPrograms.map((program) => (
                    <TableRow key={program.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{program.name}</p>
                          <p className="text-sm text-slate-400">{program.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-slate-300">
                          {program.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-white font-medium">
                          {program.type === 'Price Boost' ? `${program.amount}%` : `₹${program.amount}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">{program.participants}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-300 text-sm">{program.condition}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(program.status)}>
                          {program.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Loyalty Tab */}
        <TabsContent value="customer-loyalty">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-400" />
                  Loyalty Program Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{loyaltyProgram.totalMembers.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Total Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{(loyaltyProgram.pointsIssued / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-slate-400">Points Issued</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {loyaltyProgram.tiers.map((tier, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          tier.name === 'Bronze' ? 'bg-orange-400' :
                          tier.name === 'Silver' ? 'bg-slate-400' :
                          tier.name === 'Gold' ? 'bg-yellow-400' : 'bg-purple-400'
                        }`}></div>
                        <div>
                          <p className="font-medium text-white">{tier.name}</p>
                          <p className="text-xs text-slate-400">Min: {tier.minPoints} points</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{tier.members}</p>
                        <p className="text-xs text-slate-400">members</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Loyalty Rewards Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Points per ₹1 spent</Label>
                  <Input 
                    defaultValue="1" 
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Minimum redemption points</Label>
                  <Input 
                    defaultValue="100" 
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Point value (₹)</Label>
                  <Input 
                    defaultValue="0.10" 
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Marketing Tab */}
        <TabsContent value="email-marketing">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-purple-400" />
                  Email Campaigns
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Send className="mr-2 h-4 w-4" />
                  New Email Campaign
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead className="text-slate-300">Subject</TableHead>
                    <TableHead className="text-slate-300">Recipients</TableHead>
                    <TableHead className="text-slate-300">Open Rate</TableHead>
                    <TableHead className="text-slate-300">Click Rate</TableHead>
                    <TableHead className="text-slate-300">Sent Date</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailCampaigns.map((email) => (
                    <TableRow key={email.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell>
                        <p className="font-medium text-white">{email.subject}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-white">{email.recipients.toLocaleString()}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-green-400 font-medium">{email.openRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-blue-400 font-medium">{email.clickRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-slate-300">{new Date(email.sentDate).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(email.status)}>
                          {email.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social-media">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-blue-400" />
                  Social Media Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Facebook className="h-5 w-5 text-blue-500" />
                      <span className="text-white">Facebook</span>
                    </div>
                    <Badge className="bg-green-900/20 text-green-400">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Instagram className="h-5 w-5 text-pink-500" />
                      <span className="text-white">Instagram</span>
                    </div>
                    <Badge className="bg-green-900/20 text-green-400">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Twitter className="h-5 w-5 text-blue-400" />
                      <span className="text-white">Twitter</span>
                    </div>
                    <Badge className="bg-yellow-900/20 text-yellow-400">Pending</Badge>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Connect New Platform
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardHeader>
                <CardTitle className="text-white">Create Social Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Post Content</Label>
                  <Textarea 
                    placeholder="What's happening at KrishiBondhu today?"
                    className="bg-slate-800 border-slate-700 text-white resize-none"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Platforms</Label>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="cursor-pointer border-blue-500 text-blue-400">
                      Facebook
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer border-pink-500 text-pink-400">
                      Instagram
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Post Now
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Marketing Campaign</DialogTitle>
            <DialogDescription className="text-slate-400">
              Set up a new marketing campaign to engage your audience
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Campaign Name</Label>
              <Input className="bg-slate-800 border-slate-700 text-white" placeholder="Enter campaign name" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Campaign Type</Label>
              <Select>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                  <SelectItem value="acquisition">Acquisition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Target Audience</Label>
              <Select>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="farmers">Farmers</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="warehouses">Warehouses</SelectItem>
                  <SelectItem value="delivery">Delivery Partners</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Budget (₹)</Label>
              <Input 
                className="bg-slate-800 border-slate-700 text-white" 
                placeholder="Enter budget amount"
                type="number"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Campaign Description</Label>
            <Textarea 
              className="bg-slate-800 border-slate-700 text-white resize-none" 
              placeholder="Describe your campaign objectives and strategy"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsCreateCampaignOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCampaign}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingTools;