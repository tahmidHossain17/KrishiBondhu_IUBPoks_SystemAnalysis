import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Textarea } from '../../components/ui/textarea';
import {
  MapPin,
  Navigation,
  Camera,
  CheckCircle,
  Package,
  User,
  Phone,
  Clock,
  AlertTriangle,
  PenTool,
  FileCheck,
  Truck,
  QrCode,
  Star,
  MessageCircle
} from 'lucide-react';

const PickupConfirmation: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>({
    id: 'ORD001',
    customerName: 'Green Mart Supermarket',
    pickupAddress: 'KrishiBondhu Central Warehouse, Sector 63, Noida, UP 201301',
    warehouseContact: '+880 120-4567890',
    warehouseManager: 'Rajesh Kumar Sharma',
    items: [
      { id: 1, name: 'Basmati Rice', quantity: '5 kg', verified: false, condition: '', batchNumber: 'BATCH_001' },
      { id: 2, name: 'Fresh Tomatoes', quantity: '2 kg', verified: false, condition: '', batchNumber: 'BATCH_002' },
      { id: 3, name: 'Organic Wheat', quantity: '3 kg', verified: false, condition: '', batchNumber: 'BATCH_003' }
    ],
    totalValue: 575,
    deliveryFee: 185
  });

  const [verificationChecklist] = useState([
    { id: 1, item: 'Verify warehouse location and entrance', checked: false },
    { id: 2, item: 'Check warehouse manager ID and credentials', checked: false },
    { id: 3, item: 'Confirm order ID and customer details', checked: false },
    { id: 4, item: 'Inspect all items for quality and quantity', checked: false },
    { id: 5, item: 'Verify batch numbers and expiry dates', checked: false },
    { id: 6, item: 'Take photos of all items', checked: false },
    { id: 7, item: 'Get warehouse manager signature', checked: false },
    { id: 8, item: 'Update pickup status to customer', checked: false }
  ]);

  const [checklistItems, setChecklistItems] = useState(verificationChecklist);
  const [pickupPhotos, setPickupPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [signatureCaptured, setSignatureCaptured] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Location, 2: Verification, 3: Confirmation

  const updateChecklistItem = (id: number, checked: boolean) => {
    setChecklistItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const updateItemVerification = (itemId: number, verified: boolean, condition: string = '') => {
    setSelectedOrder((order: any) => ({
      ...order,
      items: order.items.map((item: any) => 
        item.id === itemId ? { ...item, verified, condition } : item
      )
    }));
  };

  const addPhoto = () => {
    // Simulate photo capture
    const newPhoto = `/placeholder-photo-${pickupPhotos.length + 1}.jpg`;
    setPickupPhotos([...pickupPhotos, newPhoto]);
  };

  const getCompletionPercentage = () => {
    const totalItems = checklistItems.length + selectedOrder.items.length;
    const completedItems = checklistItems.filter(item => item.checked).length + 
                          selectedOrder.items.filter((item: any) => item.verified).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return checklistItems.slice(0, 3).every(item => item.checked);
      case 2:
        return selectedOrder.items.every((item: any) => item.verified) && 
               checklistItems.slice(3, 6).every(item => item.checked);
      case 3:
        return checklistItems.every(item => item.checked) && 
               signatureCaptured && 
               pickupPhotos.length >= selectedOrder.items.length;
      default:
        return false;
    }
  };

  const handleCompletePickup = () => {
    console.log('Pickup completed for order:', selectedOrder.id);
    // Handle pickup completion logic
    alert('Pickup completed successfully! Proceeding to delivery.');
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">Pickup Confirmation</h1>
            <p className="text-sm text-green-100">Order {selectedOrder.id}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
            <div className="text-xs text-green-100">Complete</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300" 
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Step Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            {[
              { step: 1, label: 'Location', icon: MapPin },
              { step: 2, label: 'Verification', icon: Package },
              { step: 3, label: 'Confirmation', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }) => (
              <Button
                key={step}
                variant={currentStep === step ? "default" : currentStep > step ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(step)}
                className={`flex-1 mx-1 ${
                  currentStep === step ? 'bg-blue-600' : 
                  currentStep > step ? 'bg-green-600' : ''
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Warehouse Location */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="mr-2 h-5 w-5 text-red-600" />
                Warehouse Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-blue-200 mb-4">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">KrishiBondhu Central Warehouse</p>
                  <p className="text-sm text-blue-600">Sector 63, Noida, UP 201301</p>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm">
                      <Navigation className="mr-2 h-4 w-4" />
                      Navigate
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>

              {/* Warehouse Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Warehouse Manager</p>
                    <p className="text-sm text-slate-600">{selectedOrder.warehouseManager}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <p className="font-medium text-sm text-yellow-800">Important Instructions</p>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Enter through Gate 2 for pickup deliveries</li>
                    <li>• Show order ID and your delivery partner ID</li>
                    <li>• Parking available in designated delivery zone</li>
                    <li>• Operating hours: 6:00 AM - 10:00 PM</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Initial Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileCheck className="mr-2 h-5 w-5 text-green-600" />
                Arrival Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklistItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <Checkbox
                      id={`checklist-${item.id}`}
                      checked={item.checked}
                      onCheckedChange={(checked) => updateChecklistItem(item.id, checked as boolean)}
                    />
                    <label htmlFor={`checklist-${item.id}`} className="text-sm flex-1">
                      {item.item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Product Verification */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2 h-5 w-5 text-blue-600" />
                Product Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} className={`border rounded-lg p-4 ${item.verified ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.verified ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.verified ? <CheckCircle className="h-4 w-4" /> : item.id}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-slate-600">Quantity: {item.quantity}</p>
                          <p className="text-xs text-slate-500">Batch: {item.batchNumber}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={item.verified ? "default" : "outline"}
                        onClick={() => updateItemVerification(item.id, !item.verified, item.verified ? '' : 'Good condition')}
                        className={item.verified ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {item.verified ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verified
                          </>
                        ) : (
                          <>
                            <QrCode className="h-4 w-4 mr-2" />
                            Verify
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {item.verified && (
                      <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
                        ✓ Item verified - {item.condition || 'Good condition'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verification Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklistItems.slice(3, 6).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <Checkbox
                      id={`checklist-${item.id}`}
                      checked={item.checked}
                      onCheckedChange={(checked) => updateChecklistItem(item.id, checked as boolean)}
                    />
                    <label htmlFor={`checklist-${item.id}`} className="text-sm flex-1">
                      {item.item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photo Capture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Camera className="mr-2 h-5 w-5 text-purple-600" />
                Photo Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {pickupPhotos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                ))}
                {pickupPhotos.length < selectedOrder.items.length && (
                  <Button
                    variant="outline"
                    className="aspect-square flex-col"
                    onClick={addPhoto}
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </Button>
                )}
              </div>
              <p className="text-sm text-slate-600">
                Photos captured: {pickupPhotos.length} / {selectedOrder.items.length} required
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Final Confirmation */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <PenTool className="mr-2 h-5 w-5 text-orange-600" />
                Digital Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-4">
                <PenTool className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 mb-4">Warehouse Manager Signature Required</p>
                <Button 
                  variant={signatureCaptured ? "default" : "outline"}
                  onClick={() => setSignatureCaptured(true)}
                  className={signatureCaptured ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {signatureCaptured ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Signature Captured
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-4 w-4" />
                      Capture Signature
                    </>
                  )}
                </Button>
              </div>
              
              {signatureCaptured && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    ✓ Signature captured from {selectedOrder.warehouseManager}
                  </p>
                  <p className="text-xs text-green-600">
                    Timestamp: {new Date().toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Final Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Final Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklistItems.slice(6).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <Checkbox
                      id={`checklist-${item.id}`}
                      checked={item.checked}
                      onCheckedChange={(checked) => updateChecklistItem(item.id, checked as boolean)}
                    />
                    <label htmlFor={`checklist-${item.id}`} className="text-sm flex-1">
                      {item.item}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-600" />
                Pickup Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any observations or special notes about the pickup..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex space-x-3 sticky bottom-20 bg-white p-4 border-t">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1"
          >
            Previous
          </Button>
        )}
        
        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceedToNextStep()}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Next Step
          </Button>
        ) : (
          <Button
            onClick={handleCompletePickup}
            disabled={!canProceedToNextStep()}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Truck className="mr-2 h-4 w-4" />
            Complete Pickup
          </Button>
        )}
      </div>

      {/* Summary Card */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Order Summary</p>
              <p className="font-medium">{selectedOrder.customerName}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">৳{selectedOrder.deliveryFee}</p>
              <p className="text-xs text-slate-600">Delivery fee</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PickupConfirmation;